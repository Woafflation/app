import React, { useMemo } from 'react'
import DashboardMetricChart from '../../../components/DashboardMetricChart/DashboardMetricChart'
import {
  DEX_INTERVAL_SELECTORS,
  makeMetric
} from '../../../components/DashboardMetricChart/utils'
import { Metric } from '../../dataHub/metrics'

export const DEX_VOLUME_METRICS = [
  makeMetric('total_trade_volume_by_dex', 'Total Trade Volume'),
  makeMetric('eth_based_trade_volume_by_dex', 'ETH Based Tokens'),
  makeMetric('stablecoin_trade_volume_by_dex', 'Stablecoins'),
  makeMetric('other_trade_volume_by_dex', 'Other')
]

export function mapDEXMetrics (metrics, measurement, addPriceMetric = false) {
  const measurementSlug = measurement.slug.replace(/-/g, '_')

  const dexMetrics = metrics.map(({ key, label }) => {
    return {
      key: `${measurementSlug}_${key}`,
      queryKey: key,
      label,
      node: 'bar',
      fill: true,
      domainGroup: 'decentralized_exchanges',
      reqMeta: { slug: measurement.slug }
    }
  })

  if (addPriceMetric) {
    dexMetrics.push({
      ...Metric.price_usd,
      key: 'price_usd',
      label: `Price ${measurement.label}`,
      reqMeta: { slug: measurement.slug }
    })
  }

  return dexMetrics
}

const DexTradesSegmentedByDEX = ({ measurement }) => {
  const metrics = useMemo(
    () => {
      return mapDEXMetrics(DEX_VOLUME_METRICS, measurement, true)
    },
    [measurement]
  )

  return (
    <DashboardMetricChart
      metrics={metrics}
      intervals={DEX_INTERVAL_SELECTORS}
    />
  )
}

export default DexTradesSegmentedByDEX
