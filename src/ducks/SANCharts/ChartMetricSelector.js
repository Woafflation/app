import React, { useState } from 'react'
import GA from 'react-ga'
import cx from 'classnames'
import { graphql } from 'react-apollo'
import Panel from '@santiment-network/ui/Panel'
import Loader from '@santiment-network/ui/Loader/Loader'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import MetricExplanation from './MetricExplanation'
import ExplanationTooltip from '../../components/ExplanationTooltip/ExplanationTooltip'
import { PROJECT_METRICS_BY_SLUG_QUERY } from './gql'
import { Metrics, Events, getMarketSegment } from './utils'
import styles from './ChartMetricSelector.module.scss'

const NO_GROUP = '_'

Events.trendPositionHistory.note = (
  <p className={styles.note}>
    <span className={styles.warning}>Important!</span>
    <span className={styles.text}>It will disable Anomalies</span>
  </p>
)

const addItemToGraph = (categories, metricCategory, metrics) => {
  const category = categories[metricCategory]
  if (category) {
    category.push(...metrics)
  } else {
    categories[metricCategory] = metrics
  }
}

const getCategoryGraph = availableMetrics => {
  if (availableMetrics.length === 0) {
    return {}
  }

  const categories = {
    Financial: undefined,
    Social: [Events.trendPositionHistory]
  }
  const { length } = availableMetrics

  for (let i = 0; i < length; i++) {
    const availableMetric = availableMetrics[i]
    const metric =
      typeof availableMetric === 'object'
        ? availableMetric
        : Metrics[availableMetric]

    if (!metric) {
      continue
    }

    if (Array.isArray(metric)) {
      const metricCategory = metric[0].category
      addItemToGraph(categories, metricCategory, metric)
      continue
    }

    const metricCategory = metric.category
    const metrics = [metric]

    if (metric.key === 'historyPrice') {
      metrics.push(Metrics.volume)
    }

    addItemToGraph(categories, metricCategory, metrics)
  }

  Object.keys(categories).forEach(key => {
    categories[key] = categories[key].reduce((acc, metric) => {
      const { group = NO_GROUP } = metric
      addItemToGraph(acc, group, [metric])
      return acc
    }, {})
  })

  return categories
}

const ActionBtn = ({ metric, children, isActive, isDisabled, ...props }) => {
  return (
    <Button
      variant='ghost'
      fluid
      className={styles.btn}
      classes={styles}
      isActive={isActive}
      disabled={isDisabled}
      {...props}
    >
      <div className={styles.btn__left}>
        {isDisabled ? (
          <span className={styles.btn_disabled}>no data</span>
        ) : (
          <ExplanationTooltip
            className={styles.btn__expl}
            text={isActive ? 'Remove metric' : 'Add metric'}
            offsetY={8}
          >
            <div
              className={cx(
                styles.btn__action,
                isActive ? styles.btn__action_remove : styles.btn__action_add
              )}
            >
              <Icon type={isActive ? 'close-small' : 'plus'} />
            </div>
          </ExplanationTooltip>
        )}{' '}
        {children}
      </div>
      <MetricExplanation {...metric}>
        <Icon type='info-round' className={styles.info} />
      </MetricExplanation>
    </Button>
  )
}

const countCategoryActiveMetrics = (activeMetrics = []) => {
  const counter = {}
  for (let i = 0; i < activeMetrics.length; i++) {
    const { category } = activeMetrics[i]
    counter[category] = (counter[category] || 0) + 1
  }
  return counter
}

const ChartMetricSelector = ({
  className = '',
  toggleMetric,
  activeMetrics,
  activeEvents,
  disabledMetrics,
  categories,
  loading,
  ...props
}) => {
  const [activeCategory, setCategory] = useState('Financial')

  const actives = [...activeEvents, ...activeMetrics]
  const categoryActiveMetricsCounter = countCategoryActiveMetrics(actives)

  return (
    <Panel {...props}>
      <Panel.Title className={styles.header}>
        Select up to 5 metrics
      </Panel.Title>
      <Panel.Content className={cx(styles.wrapper, className)}>
        {loading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}

        <div className={cx(styles.column, styles.categories)}>
          {Object.keys(categories).map(category => {
            const counter = categoryActiveMetricsCounter[category]
            return (
              <div key={category} className={styles.category}>
                <Button
                  onClick={() => {
                    GA.event({
                      category: 'Chart',
                      action: `Selecting category "${category}"`
                    })
                    setCategory(category)
                  }}
                  variant='ghost'
                  fluid
                  className={styles.btn}
                  isActive={category === activeCategory}
                  classes={styles}
                >
                  {category}
                  {counter > 0 ? ` (${counter})` : ''}
                  <Icon type='arrow-right' />
                </Button>
              </div>
            )
          })}
        </div>
        <div className={cx(styles.column, styles.metrics)}>
          <div className={styles.visible}>
            <div className={styles.visible__scroll}>
              {categories[activeCategory] &&
                Object.keys(categories[activeCategory]).map(group => (
                  <div key={group} className={styles.group}>
                    {group !== NO_GROUP && (
                      <h3 className={styles.group__title}>{group}</h3>
                    )}
                    {categories[activeCategory][group].map(metric => {
                      const isActive = actives.includes(metric)
                      const isDisabled = disabledMetrics.includes(metric.key)

                      return (
                        <ActionBtn
                          key={metric.label}
                          metric={metric}
                          onClick={() => toggleMetric(metric)}
                          isActive={isActive}
                          isDisabled={isDisabled}
                        >
                          {metric.label}
                        </ActionBtn>
                      )
                    })}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Panel.Content>
    </Panel>
  )
}

export default graphql(PROJECT_METRICS_BY_SLUG_QUERY, {
  props: ({
    data: {
      loading,
      project: { availableMetrics = [], marketSegments = [] } = {}
    }
  }) => {
    const categories = getCategoryGraph(
      availableMetrics.concat(marketSegments.map(getMarketSegment))
    )

    return {
      loading,
      categories
    }
  },
  options: ({ slug }) => {
    return { variables: { slug } }
  }
})(ChartMetricSelector)
