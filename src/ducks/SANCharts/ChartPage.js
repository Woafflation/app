import React, { Component } from 'react'
import * as qs from 'query-string'
import { connect } from 'react-redux'
import cx from 'classnames'
import Loadable from 'react-loadable'
import { linearScale, logScale } from '@santiment-network/chart/scales'
import GetTimeSeries from '../../ducks/GetTimeSeries/GetTimeSeries'
import { ERRORS } from '../GetTimeSeries/reducers'
import Chart from './Chart'
import Synchronizer from './Chart/Synchronizer'
import Header from './Header'
import { getMarketSegment, mapDatetimeToNumber } from './utils'
import {
  Metrics,
  Events,
  compatabilityMap,
  SOCIAL_SIDEBAR,
  ASSETS_SIDEBAR,
  HISTOGRAM_SIDEBAR
} from './data'
import { getNewInterval, INTERVAL_ALIAS } from './IntervalSelector'
import GA from './../../utils/tracking'
import UpgradePaywall from './../../components/UpgradePaywall/UpgradePaywall'
import { getIntervalByTimeRange, parseIntervalString } from '../../utils/dates'
import { mapParsedTrueFalseFields } from '../../utils/utils'
import { checkHasPremium } from '../../pages/UserSelectors'
import StoriesList from '../../components/Stories/StoriesList'
import styles from './ChartPage.module.scss'

const DEFAULT_TIME_RANGE = '6m'

const { from: FROM, to: TO } = getIntervalByTimeRange(DEFAULT_TIME_RANGE)

const MAX_METRICS_PER_CHART = 5

const DEFAULT_STATE = {
  isLogScale: false,
  timeRange: DEFAULT_TIME_RANGE,
  from: FROM.toISOString(),
  to: TO.toISOString(),
  slug: 'santiment',
  metrics: [Metrics.historyPrice],
  title: 'Santiment (SAN)',
  projectId: '16912',
  interval: getNewInterval(FROM, TO),
  isAdvancedView: false,
  enabledViewOnlySharing: true,
  isShowAnomalies: !localStorage.getItem('hideAnomalies'),
  events: [],
  marketSegments: [],
  isMultiChartsActive: true
}

const LoadableHistogramSidebar = Loadable({
  loader: () => import('./Histogram'),
  loading: () => <div />
})

const LoadableSocialContextSidebar = Loadable({
  loader: () => import('./SocialContext'),
  loading: () => <div />
})

const LoadableChartSidecar = Loadable({
  loader: () => import('./ChartSidecar'),
  loading: () => <div />
})

const LoadableChartSettings = Loadable({
  loader: () => import('./ChartSettings'),
  loading: () => <div />
})

const LoadableChartMetricsTool = Loadable({
  loader: () => import('./ChartMetricsTool'),
  loading: () => <div />
})

const metricObjToQSMapper = ({ key }) => key

const mapPassedState = state => {
  const { metrics, events, marketSegments } = state
  if (metrics) {
    state.metrics = metrics.map(
      metric => Metrics[metric] || compatabilityMap[metric]
    )
  }
  if (events) state.events = events.map(event => Events[event])
  if (marketSegments) {
    state.marketSegments = marketSegments.map(getMarketSegment)
  }
}

const INTERVAL_FORMAT_INDEX = {
  m: 0,
  h: 1,
  d: 2,
  w: 3
}

const getChartInitialState = props => {
  let passedState
  if (props.location && props.location.search) {
    const data = mapParsedTrueFalseFields(
      qs.parse(props.location.search, { arrayFormat: 'comma' })
    )
    if (typeof data.metrics === 'string') {
      data.metrics = [data.metrics]
    }
    if (typeof data.events === 'string') {
      data.events = [data.events]
    }
    if (typeof data.marketSegments === 'string') {
      data.marketSegments = [data.marketSegments]
    }
    mapPassedState(data)
    passedState = data
  } else {
    let {
      slug,
      from,
      to,
      title,
      timeRange,
      metrics,
      interval,
      events,
      marketSegments
    } = props

    if (!from) {
      const { from: f, to: t } = getIntervalByTimeRange(timeRange)
      from = f.toISOString()
      to = t.toISOString()
      interval = getNewInterval(from, to)
    }
    passedState = {
      slug,
      title,
      metrics,
      events,
      from,
      to,
      timeRange,
      interval,
      marketSegments
    }
  }

  return {
    ...DEFAULT_STATE,
    ...passedState
  }
}

class ChartPage extends Component {
  static defaultProps = { ...DEFAULT_STATE, adjustNightMode: true }

  // HACK(vanguard):  fixing navbar-search project selection
  static getDerivedStateFromProps ({ slug, title, isControlled }, state) {
    if (isControlled && slug && slug !== state.slug) {
      return {
        slug,
        title
      }
    }

    return null
  }

  chartRef = React.createRef()

  state = getChartInitialState(this.props)

  onZoom = (leftZoomIndex, rightZoomIndex, leftZoomDate, rightZoomDate) => {
    const { from, to, interval } = this.state

    const newFrom = new Date(leftZoomDate)
    const newTo = new Date(rightZoomDate)
    const newInterval = getNewInterval(leftZoomDate, rightZoomDate)

    this.setState(
      {
        zoom: [from, to, interval],
        from: newFrom.toISOString(),
        to: newTo.toISOString(),
        interval: newInterval,
        timeRange: undefined
      },
      this.updateSearchQuery
    )
  }

  onZoomOut = () => {
    const [from, to, interval] = this.state.zoom
    this.setState(
      { zoom: undefined, from, to, interval },
      this.updateSearchQuery
    )
  }

  onTimerangeChange = timeRange => {
    const { from, to } = getIntervalByTimeRange(timeRange)
    const interval = getNewInterval(from, to)
    this.setState(
      {
        timeRange,
        from: from.toISOString(),
        to: to.toISOString(),
        interval,
        zoom: undefined
      },
      this.updateSearchQuery
    )
  }

  onCalendarChange = ([from, to]) => {
    const interval = getNewInterval(from, to)

    this.setState(
      {
        from: from.toISOString(),
        to: to.toISOString(),
        zoom: undefined,
        timeRange: undefined,
        interval
      },
      this.updateSearchQuery
    )
  }

  onSlugSelect = project => {
    if (!project) return

    const { slug, name, ticker, id: projectId } = project
    this.setState(
      { projectId, slug, title: `${name} (${ticker})` },
      this.updateSearchQuery
    )

    const { onSlugSelect } = this.props
    if (onSlugSelect) {
      onSlugSelect(project)
    }
  }

  onIntervalChange = interval => {
    this.setState({ interval }, this.updateSearchQuery)
  }

  onMultiChartsChange = () => {
    this.setState(
      ({ isMultiChartsActive }) => ({
        isMultiChartsActive: !isMultiChartsActive
      }),
      this.updateSearchQuery
    )
  }

  toggleMetric = metric => {
    const { type = 'metrics', label } = metric

    this.setState(state => {
      const newMetrics = new Set(state[type])
      if (newMetrics.has(metric)) {
        newMetrics.delete(metric)

        GA.event({
          category: 'Chart',
          action: `Removing "${label}"`
        })
      } else {
        const metricsAmount = state.metrics.length + state.marketSegments.length
        if (
          metricsAmount >= MAX_METRICS_PER_CHART &&
          metric !== Events.trendPositionHistory
        ) {
          return state
        }
        newMetrics.add(metric)

        GA.event({
          category: 'Chart',
          action: `Showing "${label}"`
        })
      }
      return {
        ...state,
        [type]: [...newMetrics]
      }
    }, this.updateSearchQuery)
  }

  onNightModeSelect = () => {
    const { nightMode } = this.state

    this.setState(
      { nightMode: nightMode ? undefined : true },
      this.updateSearchQuery
    )
  }

  onScaleChange = () => {
    this.setState(
      ({ isLogScale }) => ({ isLogScale: !isLogScale }),
      this.updateSearchQuery
    )
  }

  onToggleAnomalies = () => {
    const { isShowAnomalies } = this.state
    const toggledState = !isShowAnomalies
    this.setState({ isShowAnomalies: toggledState }, () => {
      if (toggledState) {
        localStorage.removeItem('hideAnomalies')
      } else {
        localStorage.setItem('hideAnomalies', '+')
      }
      this.updateSearchQuery()
    })
  }

  mapStateToQS = ({ isAdvancedView, isMultiChartsActive, ...props }) =>
    '?' + qs.stringify(props, { arrayFormat: 'comma' })

  updateSearchQuery () {
    const { location, history } = this.props
    if (!location && !history) {
      return
    }

    const { metrics, events, marketSegments } = this.state
    history.replace({
      search: this.mapStateToQS({
        ...this.state,
        metrics: metrics.map(metricObjToQSMapper),
        events: events.map(metricObjToQSMapper),
        marketSegments: marketSegments.map(metricObjToQSMapper)
      }),
      state: location.state
    })
  }

  generateShareLink = disabledMetrics => {
    const {
      slug,
      title,
      metrics,
      marketSegments,
      events,
      interval,
      nightMode,
      isShowAnomalies,
      zoom,
      from,
      to,
      isLogScale,
      isMultiChartsActive
    } = this.state

    const { enabledViewOnlySharing } = this.props

    const settings = {
      slug,
      metrics: metrics
        .filter(({ key }) => !disabledMetrics.includes(key))
        .map(metricObjToQSMapper),
      events: events.map(metricObjToQSMapper),
      marketSegments: marketSegments.map(metricObjToQSMapper),
      interval,
      nightMode,
      isShowAnomalies,
      title,
      isLogScale,
      isMultiChartsActive
    }

    if (enabledViewOnlySharing) {
      settings.viewOnly = true
    }

    if (zoom) {
      const [, , zoomFrom, zoomTo] = zoom
      settings.from = zoomFrom
      settings.to = zoomTo
    } else if (from && to) {
      settings.from = from
      settings.to = to
    }

    const { sharePath } = this.props
    const { origin, pathname } = window.location

    return `${origin}${sharePath || pathname}?${qs.stringify(settings, {
      arrayFormat: 'comma'
    })}`
  }

  onSidebarToggleClick = activeSidebar => {
    this.setState(prev => ({
      isAdvancedView:
        prev.isAdvancedView === activeSidebar ? false : activeSidebar
    }))
  }

  render () {
    const {
      timeRange,
      slug,
      metrics,
      events,
      marketSegments,
      from,
      to,
      interval,
      viewOnly,
      title,
      isLogScale,
      nightMode,
      isShowAnomalies,
      isAdvancedView,
      isMultiChartsActive
    } = this.state

    const {
      hideSettings = {},
      classes = {},
      adjustNightMode,
      showToggleAnomalies,
      leftBoundaryDate,
      rightBoundaryDate,
      isLoggedIn,
      isPRO,
      isBeta,
      alwaysShowingMetrics = [],
      isParentLoading,
      isWideChart,
      project,
      hasPremium,
      metricRest
    } = this.props

    const selectedInterval = INTERVAL_ALIAS[interval] || interval
    const selectedIntervalIndex =
      INTERVAL_FORMAT_INDEX[parseIntervalString(selectedInterval).format]

    const isIntervalSmallerThanDay = selectedIntervalIndex < 2

    const requestedMetrics = metrics.map(metric => {
      let resInterval = selectedInterval
      if (
        selectedIntervalIndex < 1 &&
        metric !== Metrics.historyPrice &&
        metric !== Metrics.volume &&
        metric !== Metrics.marketcap
      ) {
        resInterval = '1h'
      }

      const { key, reqMeta } = metric

      return {
        name: key,
        interval: resInterval,
        slug,
        from,
        to,
        ...reqMeta,
        ...metricRest
      }
    })

    const anomalyMetrics =
      isShowAnomalies && isBeta
        ? metrics.filter(({ anomalyKey }) => anomalyKey)
        : []

    const requestedEvents = events
      .concat(anomalyMetrics)
      .map(({ key, anomalyKey }) => ({
        name: anomalyKey ? 'anomalies' : key,
        from,
        to,
        slug,
        interval: selectedInterval,
        metric: anomalyKey,
        metricKey: key
      }))

    const requestedMarketSegments = marketSegments.map(
      ({ key: name, reqMeta }) => ({
        name,
        from,
        to,
        slug,
        interval: selectedInterval,
        ...reqMeta
      })
    )

    if (adjustNightMode) {
      document.body.classList.toggle('night-mode', !!nightMode)
    }

    return (
      <GetTimeSeries
        events={requestedEvents}
        metrics={requestedMetrics}
        marketSegments={requestedMarketSegments}
        render={({
          timeseries = [],
          eventsData = [],
          errorMetrics = {},
          isError,
          isLoading,
          errorType,
          trendPositionHistory
        }) => {
          if (isError) {
            if (errorType === ERRORS.COMPLEXITY) {
              return (
                <div>
                  Too complexed request
                  <br />
                  Decrease number of points
                </div>
              )
            }
            return <div>Something is going wrong</div>
          }

          const errors = Object.keys(errorMetrics)
          const finalMetrics = metrics
            .concat(marketSegments)
            .filter(({ key }) => !errors.includes(key))

          // NOTE(haritonasty): we don't show anomalies when trendPositionHistory is in activeMetrics
          const isTrendsShowing = trendPositionHistory !== undefined
          const eventsFiltered = isTrendsShowing
            ? eventsData.filter(({ metricAnomalyKey }) => !metricAnomalyKey)
            : eventsData.filter(({ metricAnomalyKey }) =>
            // NOTE: Diplaying anomaly dots only for active metrics [@vanguard | Nov 06, 2019]
              metrics.some(({ key }) => key === metricAnomalyKey)
            )

          const metricsTool = (
            <LoadableChartMetricsTool
              classes={styles}
              slug={slug}
              toggleMetric={this.toggleMetric}
              disabledMetrics={errorMetrics}
              activeMetrics={finalMetrics}
              activeEvents={events}
              showToggleAnomalies={showToggleAnomalies}
              onToggleAnomalies={this.onToggleAnomalies}
              isShowAnomalies={isShowAnomalies}
              alwaysShowingMetrics={alwaysShowingMetrics}
              hideSettings={hideSettings}
              isWideChart={isWideChart}
            />
          )

          return (
            <>
              {viewOnly || hideSettings.header || (
                <>
                  {isWideChart && <StoriesList classes={styles} />}
                  <Header
                    slug={slug}
                    isLoading={isParentLoading}
                    isLoggedIn={isLoggedIn}
                    onSlugSelect={this.onSlugSelect}
                  />
                </>
              )}
              <div className={styles.wrapper}>
                <div
                  className={cx(
                    styles.tool,
                    isAdvancedView && styles.toolShort,
                    isWideChart && styles.toolWideChart
                  )}
                >
                  <div
                    className={cx(
                      styles.container,
                      isWideChart && styles.wideChartBg
                    )}
                  >
                    {!viewOnly && (
                      <>
                        <LoadableChartSettings
                          defaultTimerange={timeRange}
                          onTimerangeChange={this.onTimerangeChange}
                          onCalendarChange={this.onCalendarChange}
                          generateShareLink={this.generateShareLink}
                          onNightModeSelect={this.onNightModeSelect}
                          onMultiChartsChange={this.onMultiChartsChange}
                          isMultiChartsActive={isMultiChartsActive}
                          isNightModeActive={nightMode}
                          showNightModeToggle={adjustNightMode}
                          disabledMetrics={errors}
                          from={from}
                          to={to}
                          isLogScale={isLogScale}
                          onScaleChange={this.onScaleChange}
                          isAdvancedView={isAdvancedView}
                          classes={classes}
                          activeMetrics={finalMetrics}
                          title={title}
                          chartRef={this.chartRef}
                          chartData={timeseries}
                          events={events}
                          eventsData={eventsFiltered}
                          slugTitle={slug}
                          project={project}
                        />
                      </>
                    )}

                    <Synchronizer
                      isMultiChartsActive={isMultiChartsActive}
                      metrics={finalMetrics}
                      events={eventsData}
                    >
                      <Chart
                        slug={slug}
                        from={from}
                        to={to}
                        metrics={finalMetrics}
                        data={mapDatetimeToNumber(timeseries)}
                        chartRef={this.chartRef}
                        scale={isLogScale ? logScale : linearScale}
                        leftBoundaryDate={leftBoundaryDate}
                        rightBoundaryDate={rightBoundaryDate}
                        isAdvancedView={isAdvancedView}
                        isIntervalSmallerThanDay={isIntervalSmallerThanDay}
                        isLoading={isParentLoading || isLoading}
                        isWideChart={isWideChart}
                        onPointHover={this.getSocialContext}
                        hasPremium={hasPremium}
                      />
                    </Synchronizer>

                    {metricsTool}
                    {!isPRO && (
                      <UpgradePaywall
                        isAdvancedView={isAdvancedView}
                        isWideChart={isWideChart}
                      />
                    )}
                  </div>
                </div>
                {!viewOnly &&
                  !hideSettings.sidecar &&
                  (metrics.includes(Metrics.socialVolume) ||
                    events.includes(Events.trendPositionHistory)) && (
                  <LoadableSocialContextSidebar
                    onSidebarToggleClick={this.onSidebarToggleClick}
                    isAdvancedView={isAdvancedView === SOCIAL_SIDEBAR}
                    classes={classes}
                    projectName={slug}
                    interval={interval}
                    date={this.state.socialContextDate}
                    isWideChart={isWideChart}
                  />
                )}

                {!viewOnly &&
                  !hideSettings.sidecar &&
                  metrics.includes(Metrics.age_destroyed) && (
                  <LoadableHistogramSidebar
                    onSidebarToggleClick={this.onSidebarToggleClick}
                    isAdvancedView={isAdvancedView === HISTOGRAM_SIDEBAR}
                    classes={classes}
                    slug={slug}
                    interval={interval}
                    date={this.state.socialContextDate}
                    isWideChart={isWideChart}
                  />
                )}

                {!viewOnly && !hideSettings.sidecar && (
                  <LoadableChartSidecar
                    isWideChart={isWideChart}
                    onSlugSelect={this.onSlugSelect}
                    onSidebarToggleClick={this.onSidebarToggleClick}
                    isAdvancedView={isAdvancedView === ASSETS_SIDEBAR}
                    classes={classes}
                  />
                )}
              </div>
            </>
          )
        }}
      />
    )
  }

  getSocialContext = ({ value }) => {
    if (this.state.isAdvancedView) {
      this.setState({
        socialContextDate: new Date(value)
      })
    }
  }
}

const mapStateToProps = state => {
  const {
    rootUi: { isBetaModeEnabled, isWideChartEnabled }
  } = state
  return {
    isBeta: isBetaModeEnabled,
    isWideChart: isWideChartEnabled,
    hasPremium: checkHasPremium(state)
  }
}

export default connect(mapStateToProps)(ChartPage)
