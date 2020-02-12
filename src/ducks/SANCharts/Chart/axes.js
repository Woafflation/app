import { drawAxes, drawAxesTicks } from '@santiment-network/chart/axes'
import {
  isDayInterval,
  getDateDayMonthYear,
  getDateHoursMinutes
} from './utils'
import { dayTicksPaintConfig, dayAxesColor } from './paintConfigs'
import { millify } from '../../../utils/formatting'

const yFormatter = value => {
  if (value < 1) {
    return +value.toFixed(3)
  }

  if (value > 999999) {
    return millify(value, 2)
  }

  if (value > 9999) {
    return millify(value, 0)
  }

  return Math.trunc(value)
}

export function plotAxes (chart) {
  const {
    tooltipKey,
    ticksPaintConfig = dayTicksPaintConfig,
    axesColor = dayAxesColor
  } = chart

  drawAxes(chart, axesColor)
  drawAxesTicks(
    chart,
    tooltipKey,
    isDayInterval(chart) ? getDateHoursMinutes : getDateDayMonthYear,
    yFormatter,
    ticksPaintConfig
  )
}
