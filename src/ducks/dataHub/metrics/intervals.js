import { Metric } from './index'
import { INTERVAL_ALIAS } from '../../SANCharts/IntervalSelector'
import { dateDifference, DAY } from '../../../utils/dates'

function newCustomInterval (clb) {
  return (from, to) => {
    const interval = clb(
      dateDifference({
        from: new Date(from),
        to: new Date(to),
        format: DAY
      }).diff
    )
    return INTERVAL_ALIAS[interval] || interval
  }
}

const getWeightedSocialIntervals = newCustomInterval(diff =>
  diff < 33 ? '1h' : '1d'
)

export const MetricIntervalGetter = {
  [Metric.sentiment_volume_consumed_total.key]: getWeightedSocialIntervals,
  [Metric.sentiment_volume_consumed_telegram.key]: getWeightedSocialIntervals,
  [Metric.sentiment_volume_consumed_reddit.key]: getWeightedSocialIntervals,
  [Metric.sentiment_volume_consumed_twitter.key]: getWeightedSocialIntervals
}
