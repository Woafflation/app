import React, { useState, useEffect, useRef } from 'react'
import COLOR from '@santiment-network/ui/variables.scss'
import { initChart, updateChartState } from '@santiment-network/chart'
import { initTooltip } from '@santiment-network/chart/tooltip'
import { plotLines } from '@santiment-network/chart/lines'
import { plotDayBars, plotBars } from '@santiment-network/chart/bars'
import { linearScale } from '@santiment-network/chart/scales'
import { drawReferenceDot } from '@santiment-network/chart/references'
import { initBrush, updateBrushState } from '@santiment-network/chart/brush'
import Loader from './Loader/Loader'
import Signals from './Signals'
import { plotAxes } from './axes'
import { setupTooltip, plotTooltip } from './tooltip'
import {
  CHART_HEIGHT,
  BRUSH_HEIGHT,
  CHART_PADDING,
  CHART_WITH_BRUSH_PADDING
} from './settings'
import { drawWatermark } from './watermark'
import { drawPaywall } from './paywall'
import { onResize, useResizeEffect } from './resize'
import { drawLastDayPrice, withLastDayPrice } from './lastDayPrice'
import { clearCtx, findPointIndexByDate } from './utils'
import styles from './index.module.scss'

const Chart = ({
  chartRef,
  data,
  lines,
  bars,
  daybars,
  joinedCategories,
  events = [],
  scale = linearScale,
  slug,
  leftBoundaryDate,
  rightBoundaryDate,
  tooltipKey,
  lastDayPrice,
  syncedColors,
  syncedTooltipDate,
  syncTooltips = () => {},
  onPointHover = () => {},
  hasPremium,
  hasPriceMetric,
  isLoading,
  isMultiChartsActive,
  isAdvancedView,
  isWideChart
}) => {
  let [chart, setChart] = useState()
  let [brush, setBrush] = useState()
  const canvasRef = useRef()

  useEffect(() => {
    const { current: canvas } = canvasRef
    const width = canvas.parentNode.offsetWidth

    chart = initTooltip(
      initChart(
        canvas,
        width,
        CHART_HEIGHT,
        isMultiChartsActive ? CHART_PADDING : CHART_WITH_BRUSH_PADDING
      )
    )
    chart.tooltipKey = tooltipKey

    if (!isMultiChartsActive) {
      brush = initBrush(
        chart,
        width,
        BRUSH_HEIGHT,
        plotBrushData,
        onBrushChange
      )
      brush.canvas.classList.add(styles.brush)
      setBrush(brush)
    }

    setChart(chart)
    chartRef.current = canvas

    setupTooltip(chart, marker, syncTooltips)
  }, [])

  if (brush) {
    // NOTE: Because func.component works with closures, captured values might be outdated [@vanguard | Jan 23, 2020]
    brush.plotBrushData = plotBrushData
    brush.onChange = onBrushChange
  }

  useEffect(
    () => {
      chart.onPointHover = onPointHover
    },
    [onPointHover]
  )

  useEffect(
    () => {
      chart.tooltipKey = tooltipKey
    },
    [tooltipKey]
  )

  useEffect(
    () => {
      chart.colors = syncedColors
    },
    [syncedColors]
  )

  useEffect(
    () => {
      if (data.length === 0) {
        return
      }

      clearCtx(chart)
      updateChartState(chart, data, joinedCategories)
      if (brush) {
        clearCtx(brush)
        updateBrushState(brush, chart, data)
      }
      plotChart(data)
      plotAxes(chart)
    },
    [data, scale, events, lastDayPrice]
  )

  useEffect(
    () => {
      if (data.length === 0) return

      if (syncedTooltipDate) {
        const point =
          chart.points[findPointIndexByDate(chart.points, syncedTooltipDate)]
        if (point) {
          plotTooltip(chart, marker, point)
        }
      } else {
        clearCtx(chart, chart.tooltip.ctx)
      }
    },
    [syncedTooltipDate]
  )

  useEffect(handleResize, [isMultiChartsActive, isAdvancedView, isWideChart])

  useResizeEffect(handleResize, [
    isMultiChartsActive,
    isAdvancedView,
    isWideChart,
    data,
    brush
  ])

  function handleResize () {
    if (data.length === 0) {
      return
    }

    onResize(
      chart,
      isMultiChartsActive ? CHART_PADDING : CHART_WITH_BRUSH_PADDING,
      brush,
      data
    )

    if (!brush) {
      updateChartState(chart, data, joinedCategories)
      plotChart(data)
      plotAxes(chart)
    }
  }

  function onBrushChange (startIndex, endIndex) {
    const newData = data.slice(startIndex, endIndex + 1)

    updateChartState(chart, newData, joinedCategories)

    clearCtx(chart)
    plotChart(newData)
    plotAxes(chart)
  }

  function plotBrushData () {
    plotDayBars(brush, data, daybars, syncedColors, scale)
    plotBars(brush, data, bars, syncedColors, scale)
    plotLines(brush, data, lines, syncedColors, scale)
  }

  function plotChart (data) {
    drawWatermark(chart)
    plotDayBars(chart, data, daybars, syncedColors, scale)
    plotBars(chart, data, bars, syncedColors, scale)

    chart.ctx.lineWidth = 1.5
    chart.ctx.setLineDash([0])
    plotLines(chart, data, lines, syncedColors, scale)

    events.forEach(({ metric, key, datetime, value, color }) =>
      drawReferenceDot(chart, metric, datetime, color, key, value)
    )

    if (lastDayPrice) {
      drawLastDayPrice(chart, scale, lastDayPrice)
    }

    if (!hasPremium) {
      drawPaywall(chart, leftBoundaryDate, rightBoundaryDate)
    }
  }

  function marker (ctx, key, value, x, y) {
    const { colors } = chart
    const RADIUS = 4

    if (key === 'isAnomaly') {
      ctx.beginPath()
      ctx.arc(x + RADIUS, y + 1, RADIUS, 0, 2 * Math.PI)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = COLOR.persimmon
      ctx.stroke()
    } else if (key === 'trendingPosition') {
      ctx.beginPath()
      ctx.arc(x + RADIUS, y + 1, RADIUS, 0, 2 * Math.PI)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = value[1]
      ctx.stroke()
    } else {
      ctx.fillStyle = colors[key]
      ctx.fillRect(x, y, 8, 2)
    }
  }

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} />
      {hasPriceMetric && (
        <Signals chart={chart} data={data} slug={slug} scale={scale} />
      )}
      {isLoading && <Loader />}
    </div>
  )
}

export default withLastDayPrice(Chart)
