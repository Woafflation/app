import React, { useContext, useState, useEffect, useReducer } from 'react'
import { updateChartState } from '@santiment-network/chart'
import { linearScale } from '@santiment-network/chart/scales'
import { usePlotter } from './plotter'
import { clearCtx } from './utils'
import { domainModifier } from './domain'

const noop = () => {}
const DEFAULT = []
const REDUCER = () => []
export const useRedrawer = () => useReducer(REDUCER, DEFAULT)

const ChartContext = React.createContext()
const ChartSetterContext = React.createContext()
const ChartPlotterContext = React.createContext()
const ChartRedrawContext = React.createContext()

export const ChartProvider = ({
  data,
  scale,
  colors,
  categories,
  domainGroups,
  children
}) => {
  const [chart, setChart] = useState()
  const plotter = usePlotter()
  const [isAwaitingRedraw, redrawChart] = useRedrawer()

  useEffect(
    () => {
      if (!chart) return

      clearCtx(chart)

      if (data.length === 0) return

      chart.scale = scale
      chart.colors = colors
      chart.plotter = plotter
      chart.domainGroups = domainGroups

      updateChartState(
        chart,
        data,
        categories.joinedCategories,
        domainModifier,
        domainGroups
      )

      plotter.items.forEach(plot => {
        plot(chart, scale, data, colors, categories)
      })
    },
    [data, scale, colors, domainGroups, isAwaitingRedraw]
  )

  return (
    <ChartPlotterContext.Provider value={plotter}>
      <ChartRedrawContext.Provider value={redrawChart}>
        <ChartSetterContext.Provider value={setChart}>
          <ChartContext.Provider value={chart}>
            {children}
          </ChartContext.Provider>
        </ChartSetterContext.Provider>
      </ChartRedrawContext.Provider>
    </ChartPlotterContext.Provider>
  )
}

ChartProvider.defaultProps = {
  scale: linearScale
}

export const useChart = () => useContext(ChartContext)
export const useChartSetter = () => useContext(ChartSetterContext)
export const useChartPlotter = () => useContext(ChartPlotterContext)
export const useChartRedraw = () => useContext(ChartRedrawContext)
export const buildPlotter = plotter => props => {
  plotter(useChartPlotter(), props)
  return null
}
export function usePlotterRemove (id) {
  const plotter = useChartPlotter()
  const redrawChart = useChartRedraw()

  useEffect(() => {
    redrawChart()
    return () => {
      plotter.register(id, noop)
      redrawChart()
    }
  }, [])
}

export const withChartContext = Component => ({
  data,
  scale,
  colors,
  categories,
  domainGroups,
  ...props
}) => (
  <ChartProvider
    data={data}
    scale={scale}
    colors={colors}
    categories={categories}
    domainGroups={domainGroups}
  >
    <Component {...props} />
  </ChartProvider>
)
