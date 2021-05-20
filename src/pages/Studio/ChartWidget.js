import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useStore } from './stores'
import Insights from './Insights'
import Signals from '../../ducks/Chart/Signals'
import PaywallInfo from '../../ducks/Studio/Chart/PaywallInfo'

export function useWidgetsController () {
  const [widgets, setWidgets] = useState([])

  function onWidget (target, widget) {
    const Widget = { widget, target }
    setWidgets(widgets => [...widgets, Widget])
    const filter = widget => widget !== Widget
    return () => setWidgets(widgets => widgets.filter(filter))
  }

  return {
    widgets,
    onWidget
  }
}

const metricsImmute = metrics => metrics.slice()
function useWidgetMetrics (widget) {
  return useStore(widget.Metrics, metricsImmute)
}

const drawerImmute = v => Object.assign({}, v)
const ChartWidget = ({ widget, target, settings, InsightsStore }) => {
  const { isDrawing } = useStore(widget.ChartDrawer, drawerImmute)
  const metrics = useWidgetMetrics(widget)
  const whyTheGapsNode = target.querySelector('.studio-why-gaps')
  const chartContainer = widget.chart && widget.chart.canvas.parentNode

  return (
    <>
      {whyTheGapsNode &&
        ReactDOM.createPortal(
          <PaywallInfo metrics={metrics} className='mrg-s mrg--r' />,
          whyTheGapsNode
        )}

      <Insights widget={widget} InsightsStore={InsightsStore} />

      {!isDrawing &&
        chartContainer &&
        ReactDOM.createPortal(
          <Signals
            {...settings}
            metrics={metrics}
            data={[{}]}
            chart={widget.chart}
          />,
          chartContainer
        )}
    </>
  )
}

export default ChartWidget
