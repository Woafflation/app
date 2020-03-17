import React from 'react'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import MetricExplanation from '../../SANCharts/MetricExplanation'
import MetricIcon from '../../SANCharts/MetricIcon'
import { Events } from '../../SANCharts/data'
import styles from './ActiveMetrics.module.scss'

const { trendPositionHistory } = Events

const MetricButton = ({
  metric,
  colors,
  isLoading,
  isRemovable,
  toggleMetric
}) => {
  const {
    key,
    dataKey = key,
    node,
    label,
    description,
    comparedTicker
  } = metric

  return (
    <MetricExplanation
      label={label}
      description={description}
      withChildren
      closeTimeout={22}
      offsetX={8}
    >
      <Button border className={styles.btn}>
        {isLoading ? (
          <div className={styles.loader} />
        ) : (
          <MetricIcon
            node={node}
            color={colors[dataKey]}
            className={styles.label}
          />
        )}
        {label}
        {comparedTicker && ` (${comparedTicker})`}
        {isRemovable && (
          <Icon
            type='close-small'
            className={styles.icon}
            onClick={() => toggleMetric(metric)}
          />
        )}
      </Button>
    </MetricExplanation>
  )
}

export default ({
  MetricColor,
  activeMetrics,
  activeEvents,
  loadings,
  toggleMetric,
  eventLoadings,
  isMultiChartsActive
}) => {
  const isMoreThanOneMetric = activeMetrics.length > 1 || isMultiChartsActive

  return (
    <>
      {activeMetrics.map((metric, i) => (
        <MetricButton
          key={metric.key}
          metric={metric}
          colors={MetricColor}
          isLoading={loadings.includes(metric)}
          isRemovable={isMoreThanOneMetric}
          toggleMetric={toggleMetric}
        />
      ))}
      {activeEvents.includes(trendPositionHistory) && (
        <MetricButton
          isRemovable
          metric={trendPositionHistory}
          colors={MetricColor}
          toggleMetric={toggleMetric}
          isLoading={eventLoadings.length}
        />
      )}
    </>
  )
}
