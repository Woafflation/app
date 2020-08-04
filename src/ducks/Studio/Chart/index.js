import React, { useState, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { linearScale, logScale } from '@santiment-network/chart/scales'
import ChartMetricSettings from './MetricSettings'
import ChartPaywallInfo from './PaywallInfo'
import ChartActiveMetrics from './ActiveMetrics'
import IcoPrice from './IcoPrice'
import LastDayPrice from './LastDayPrice'
import SharedAxisToggle from './SharedAxisToggle'
import ContextMenu from './ContextMenu'
import ChartFullscreenBtn from './Fullscreen'
import Insights from './Insights'
import Compare from '../Compare'
import { extractMirrorMetricsDomainGroups } from '../utils'
import { useAllTimeData } from '../timeseries/hooks'
import Chart from '../../Chart'
import Signals from '../../Chart/Signals'
import { useMetricCategories } from '../../Chart/Synchronizer'
import { useDomainGroups, useAxesMetricsKey } from '../../Chart/hooks'
import { useHighlightMetricColor } from '../../Chart/colors'
import { useUser } from '../../../stores/user'
import { useMetricColor } from '../Widget/ChartWidgetColorProvider'
import styles from './index.module.scss'

const Canvas = ({
  index,
  widget,
  className,
  chartRef,
  data,
  eventsData,
  settings,
  options,
  loadings,
  eventLoadings,
  metrics,
  comparables,
  activeEvents,
  shareLink,
  ErrorMsg,
  toggleMetric,
  syncedTooltipDate,
  isICOPriceActive,
  isSingleWidget,
  isSelectingRange,
  changeTimePeriod,
  rerenderWidgets,
  TopLeftComponent = ChartActiveMetrics,
  setIsICOPriceDisabled,
  setOptions,
  setComparables,
  onPointClick,
  onDeleteChartClick,
  onRangeSelect,
  onRangeSelectStart,
  syncTooltips
}) => {
  const { isLoggedIn } = useUser()
  const categories = useMetricCategories(metrics)
  const [isDomainGroupingActive, setIsDomainGroupingActive] = useState()
  const [focusedMetricKey, setFocusedMetricKey] = useState()
  const [focusTimer, setFocusTimer] = useState()
  const [metricSettings, setMetricSettings] = useState()
  const MetricColor = useMetricColor()
  const HighlightedMetricColor = useHighlightMetricColor(
    MetricColor,
    focusedMetricKey
  )
  const domainGroups = useDomainGroups(metrics)
  const axesMetricKeys = useAxesMetricsKey(metrics, isDomainGroupingActive)
  const allTimeData = useAllTimeData(metrics, settings)
  const mirrorDomainGroups = useMemo(
    () => extractMirrorMetricsDomainGroups(domainGroups),
    [domainGroups]
  )
  const isBlurred = !isLoggedIn && index > 1
  const scale = options.isLogScale ? logScale : linearScale

  useEffect(onMetricHoverEnd, [metrics])

  function onMetricHover (metric, { currentTarget }) {
    const { parentNode } = currentTarget
    // HACK: For some reason, fast pointer movement can trigger 'mouseenter' but not 'mouseleave'
    // Hence, a metric might be stucked in the highlighted state [@vanguard | Jun 14, 2020]
    setFocusTimer(
      setTimeout(() => {
        if (parentNode.querySelector(':hover')) {
          setFocusedMetricKey(metric.key)
        }
      }, 60)
    )
  }

  function onMetricHoverEnd () {
    clearTimeout(focusTimer)
    setFocusedMetricKey()
  }

  function onBrushChangeEnd (startIndex, endIndex) {
    const start = allTimeData[startIndex]
    const end = allTimeData[endIndex]
    if (start && end) {
      changeTimePeriod(new Date(start.datetime), new Date(end.datetime))
    }
  }

  function onMetricSettingsClick (metric) {
    setMetricSettings(metric === metricSettings ? undefined : metric)
  }

  function onMetricRemove (metric) {
    if (metric === metricSettings) {
      setMetricSettings()
    }
    toggleMetric(metric)
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <div className={cx(styles.top, isBlurred && styles.blur)}>
        <div className={styles.metrics}>
          <TopLeftComponent
            isWithSettings
            className={styles.metric}
            settings={settings}
            MetricColor={MetricColor}
            activeMetrics={metrics}
            activeEvents={activeEvents}
            metricSettings={metricSettings}
            loadings={loadings}
            ErrorMsg={ErrorMsg}
            eventLoadings={eventLoadings}
            isSingleWidget={isSingleWidget}
            toggleMetric={onMetricRemove}
            onMetricHover={onMetricHover}
            onMetricHoverEnd={onMetricHoverEnd}
            onSettingsClick={onMetricSettingsClick}
          />
        </div>

        <div className={styles.meta}>
          <ChartPaywallInfo metrics={metrics} />

          {domainGroups && domainGroups.length > mirrorDomainGroups.length && (
            <SharedAxisToggle
              isDomainGroupingActive={isDomainGroupingActive}
              setIsDomainGroupingActive={setIsDomainGroupingActive}
            />
          )}

          <Compare
            comparables={comparables}
            setComparables={setComparables}
            activeMetrics={metrics}
            MetricColor={MetricColor}
            slug={settings.slug}
            className={styles.compare}
          />

          <ContextMenu
            {...options}
            setOptions={setOptions}
            onDeleteChartClick={isSingleWidget ? undefined : onDeleteChartClick}
            classes={styles}
            chartRef={chartRef}
            title={settings.title}
            activeMetrics={metrics}
            data={data}
            shareLink={shareLink}
          />

          <ChartFullscreenBtn
            categories={categories}
            options={options}
            settings={settings}
            metrics={metrics}
            activeEvents={activeEvents}
            scale={scale}
            brushData={allTimeData}
            MetricColor={MetricColor}
            shareLink={shareLink}
          />
        </div>
      </div>

      {metricSettings && (
        <ChartMetricSettings
          className={styles.settings}
          metric={metricSettings}
          widget={widget}
          rerenderWidgets={rerenderWidgets}
        />
      )}

      <Chart
        {...categories}
        {...options}
        {...settings}
        data={data}
        events={eventsData}
        brushData={allTimeData}
        chartRef={chartRef}
        className={cx(styles.chart, isBlurred && styles.blur)}
        MetricColor={HighlightedMetricColor}
        metrics={metrics}
        scale={scale}
        domainGroups={
          isDomainGroupingActive ? domainGroups : mirrorDomainGroups
        }
        tooltipKey={axesMetricKeys[0]}
        axesMetricKeys={axesMetricKeys}
        syncedTooltipDate={isBlurred || syncedTooltipDate}
        onPointClick={onPointClick}
        onBrushChangeEnd={onBrushChangeEnd}
        onRangeSelect={onRangeSelect}
        onRangeSelectStart={onRangeSelectStart}
        syncTooltips={syncTooltips}
        resizeDependencies={[axesMetricKeys]}
      >
        <IcoPrice
          {...settings}
          isICOPriceActive={isICOPriceActive}
          metrics={metrics}
          className={styles.ico}
          onResult={price => setIsICOPriceDisabled(!price)}
        />
        <LastDayPrice settings={settings} metrics={metrics} />
        {isSelectingRange || <Signals {...settings} metrics={metrics} />}
        <Insights ticker={settings.ticker} />
      </Chart>

      {isBlurred && (
        <div className={styles.restriction}>
          <Link to='/login' className={styles.restriction__link}>
            Sign in
          </Link>{' '}
          to unlock all Santiment Chart features
        </div>
      )}
    </div>
  )
}

export default Canvas
