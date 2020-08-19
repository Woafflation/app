import React, { useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import {
  createSkeletonElement,
  createSkeletonProvider
} from '@trainline/react-skeletor'
import { ProjectIcon } from '../../../components/ProjectIcon/ProjectIcon'
import { TopHolderMetric } from '../../Studio/Chart/Sidepanel/HolderDistribution/metrics'
import TopHolders from '../../Studio/Chart/Sidepanel/HolderDistribution'
import { useAllTimeData, useTimeseries } from '../../Studio/timeseries/hooks'
import { useChartColors } from '../../Chart/colors'
import Chart from '../../Chart'
import { useAxesMetricsKey } from '../../Chart/hooks'
import { metricsToPlotCategories } from '../../Chart/Synchronizer'
import ProjectSelectDialog from '../../Studio/Compare/ProjectSelectDialog'
import { Metric } from '../../dataHub/metrics'
import ActiveMetrics from '../../Studio/Chart/ActiveMetrics'
import { getIntervalByTimeRange } from '../../../utils/dates'
import { useDialogState } from '../../../hooks/dialog'
import styles from './StablecoinHolderDistribution.module.scss'

const CHART_HEIGHT = 524

const DEFAULT_ASSET = {
  id: '1552',
  name: 'Tether',
  slug: 'tether',
  ticker: 'USDT',
  rank: 4,
  marketcapUsd: 10010463777.928583,
  __typename: 'Project'
}

const H1 = createSkeletonElement('h1')

const ProjectInfo = createSkeletonProvider(
  {
    name: '_______'
  },
  ({ name }) => name === undefined,
  () => ({
    color: 'var(--mystic)',
    backgroundColor: 'var(--mystic)'
  })
)(({ name, ticker, slug, logoUrl, darkLogoUrl, onClick }) => (
  <div className={styles.selector} onClick={onClick}>
    <div className={styles.projectIcon}>
      <ProjectIcon
        size={20}
        slug={slug}
        logoUrl={logoUrl}
        darkLogoUrl={darkLogoUrl}
      />
    </div>
    <div className={styles.project}>
      <div className={styles.project__top}>
        <H1 className={styles.project__name}>
          {name} ({ticker})
        </H1>
        <div className={styles.project__arrows}>
          <Icon type='arrow-down' className={styles.project__arrow} />
        </div>
      </div>
    </div>
  </div>
))

const DEFAULT_SETTINGS = {
  ...getIntervalByTimeRange('1y')
}

const StablecoinHolderDistribution = ({ className }) => {
  const [asset, setAsset] = useState(DEFAULT_ASSET)
  const [metrics, setMetrics] = useState([
    Metric.price_usd,
    TopHolderMetric.holders_distribution_100_to_1k,
    TopHolderMetric.holders_distribution_1k_to_10k
  ])

  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    slug: asset.slug
  })

  useEffect(
    () => {
      setSettings({
        ...settings,
        slug: asset.slug
      })
    },
    [asset]
  )

  const [data, loadings, errors] = useTimeseries(metrics, settings)
  const allTimeData = useAllTimeData(metrics, {
    slug: asset.slug,
    interval: undefined
  })

  const onBrushChangeEnd = useCallback(
    (startIndex, endIndex) => {
      const from = new Date(allTimeData[startIndex].datetime)
      const to = new Date(allTimeData[endIndex].datetime)

      setSettings({ ...settings, from, to })
    },
    [data, setSettings, settings, allTimeData]
  )

  const axesMetricKeys = useAxesMetricsKey([...metrics].reverse())
  const categories = metricsToPlotCategories(metrics, {})
  const { closeDialog, openDialog, isOpened } = useDialogState()

  const toggleMetric = useCallback(
    metric => {
      const found = metrics.find(x => x === metric)

      if (found) {
        setMetrics(metrics.filter(x => x !== metric))
      } else {
        setMetrics([...metrics, metric])
      }
    },
    [metrics, setMetrics]
  )

  const MetricColor = useChartColors(metrics)

  return (
    <div className={cx(styles.container, className)}>
      <div className={styles.chartContainer}>
        <div className={styles.header}>
          <ProjectSelectDialog
            open={isOpened}
            activeSlug={asset.slug}
            onOpen={openDialog}
            onClose={closeDialog}
            onSelect={asset => {
              setAsset(asset)
              closeDialog()
            }}
            customTabs={['Stablecoins']}
            showTabs={false}
            trigger={<ProjectInfo {...asset} onClick={openDialog} />}
          />
        </div>

        <div className={styles.metricBtns}>
          <ActiveMetrics
            className={styles.metricBtn}
            MetricColor={MetricColor}
            toggleMetric={toggleMetric}
            loadings={loadings}
            activeMetrics={metrics}
            ErrorMsg={errors}
            project={asset}
          />
        </div>

        <Chart
          {...settings}
          {...categories}
          data={data}
          brushData={allTimeData}
          chartHeight={CHART_HEIGHT}
          metrics={metrics}
          isCartesianGridActive={true}
          MetricColor={MetricColor}
          tooltipKey={axesMetricKeys[0]}
          axesMetricKeys={axesMetricKeys}
          resizeDependencies={[axesMetricKeys]}
          className={styles.chart}
          onBrushChangeEnd={onBrushChangeEnd}
        />
      </div>

      <div className={styles.metrics}>
        <div className={styles.holdersTitle}>Holders Distribution</div>

        <TopHolders
          toggleMetric={toggleMetric}
          MetricColor={MetricColor}
          metrics={metrics}
          className={styles.holderMetricBtn}
          btnProps={{
            fluid: false,
            variant: 'ghost',
            loading: loadings
          }}
        />
      </div>
    </div>
  )
}

export default StablecoinHolderDistribution
