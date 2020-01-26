import React, { useState } from 'react'
import cx from 'classnames'
import { graphql } from 'react-apollo'
import Panel from '@santiment-network/ui/Panel'
import Loader from '@santiment-network/ui/Loader/Loader'
import Icon from '@santiment-network/ui/Icon'
import Button from '@santiment-network/ui/Button'
import { SearchWithSuggestions } from '@santiment-network/ui/Search'
import ToggleMetricButton from './ToggleMetricButton'
import { PROJECT_METRICS_BY_SLUG_QUERY } from './gql'
import { getMarketSegment } from './utils'
import GA from './../../utils/tracking'
import { Metrics, Events } from './data'
import styles from './ChartMetricSelector.module.scss'

const NO_GROUP = '_'

const addItemToGraph = (categories, metricCategories, metrics) => {
  ;(typeof metricCategories === 'string'
    ? [metricCategories]
    : metricCategories
  ).forEach(metricCategory => {
    const category = categories[metricCategory]
    if (category) {
      category.push(...metrics)
    } else {
      categories[metricCategory] = metrics
    }
  })
}

const getCategoryGraph = (availableMetrics, hiddenMetrics) => {
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
    const metrics = []

    if (!hiddenMetrics.find(item => item === metric)) {
      metrics.push(metric)
    }

    if (metric.key === 'historyPrice') {
      metrics.push(Metrics.volume, Metrics.marketcap)
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

const predicate = searchTerm => {
  const upperCaseSearchTerm = searchTerm.toUpperCase()
  return ({ label }) => label.toUpperCase().includes(upperCaseSearchTerm)
}

const suggestionContent = ({ label }) => label

const getMetricSuggestions = categories => {
  const suggestions = []
  for (const categoryKey in categories) {
    const category = categories[categoryKey]
    const items = []
    for (const group in category) {
      items.push(...category[group])
    }
    suggestions.push({
      suggestionContent,
      items,
      title: categoryKey,
      predicate: predicate
    })
  }
  return suggestions
}

const countCategoryActiveMetrics = (activeMetrics = []) => {
  console.log(activeMetrics)
  const counter = {}
  for (let i = 0; i < activeMetrics.length; i++) {
    let { category } = activeMetrics[i]
    if (Array.isArray(category)) {
      category = category[0]
    }
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
  isMobile,
  hiddenMetrics,
  categories,
  loading,
  ...props
}) => {
  const [activeCategory, setCategory] = useState('Financial')

  const changeCategory = category => {
    if (category === activeCategory) {
      setCategory(null)
    } else {
      GA.event({
        category: 'Chart',
        action: `Selecting category ${category}`
      })
      setCategory(category)
    }
  }

  const actives = [...activeEvents, ...activeMetrics]
  const categoryActiveMetricsCounter = countCategoryActiveMetrics(actives)

  const isActiveCategory = category => category === activeCategory
  const isActiveMetric = metric => actives.includes(metric)

  return (
    <Panel {...props}>
      <Panel.Title className={styles.header}>
        Select up to {isMobile ? 3 : 5} metrics
      </Panel.Title>
      {!isMobile && (
        <div className={styles.search}>
          <SearchWithSuggestions
            withMoreSuggestions={false}
            data={getMetricSuggestions(categories)}
            onSuggestionSelect={({ item }) => toggleMetric(item)}
            dontResetStateAfterSelection
          />
        </div>
      )}
      <Panel.Content className={cx(styles.wrapper, className)}>
        {loading && <Loader className={styles.loader} />}
        {isMobile ? (
          <div className={cx(styles.column, styles.categories)}>
            {Object.keys(categories).map(category => {
              const counter = categoryActiveMetricsCounter[category]
              const isActive = isActiveCategory(category)
              return (
                <div key={category} className={styles.category}>
                  <Button
                    onClick={() => changeCategory(category)}
                    className={styles.mobileButton}
                  >
                    <div className={styles.mobileCategory}>
                      {category}
                      {counter > 0 && (
                        <span className={styles.mobileCounter}>
                          ({counter})
                        </span>
                      )}
                    </div>
                    <Icon
                      type='arrow-right-big'
                      className={cx(
                        styles.mobileButton__arrow,
                        isActive && styles.mobileButton__arrow_active
                      )}
                    />
                  </Button>
                  {isActive && (
                    <div className={cx(styles.metrics)}>
                      {categories[activeCategory] &&
                        Object.keys(categories[activeCategory]).map(group => (
                          <div key={group} className={styles.mobileGroup}>
                            {group !== NO_GROUP && (
                              <h3 className={styles.group__title}>{group}</h3>
                            )}
                            {categories[activeCategory][group].map(metric => {
                              const error = disabledMetrics[metric.key]
                              return (
                                <ToggleMetricButton
                                  key={metric.label}
                                  metric={metric}
                                  onClick={
                                    error
                                      ? undefined
                                      : () => toggleMetric(metric)
                                  }
                                  isActive={isActiveMetric(metric)}
                                  error={error}
                                  isMobile={true}
                                  label={metric.label}
                                />
                              )
                            })}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <div className={cx(styles.column, styles.categories)}>
              {Object.keys(categories).map(category => {
                const counter = categoryActiveMetricsCounter[category]
                return (
                  <div key={category} className={styles.category}>
                    <Button
                      onClick={() => changeCategory(category)}
                      variant='ghost'
                      fluid
                      className={styles.btn}
                      isActive={isActiveCategory(category)}
                      classes={styles}
                    >
                      {category}
                      {counter > 0 && `  (${counter})`}
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
                          const error = disabledMetrics[metric.key]

                          return (
                            <ToggleMetricButton
                              key={metric.label}
                              metric={metric}
                              onClick={
                                error ? undefined : () => toggleMetric(metric)
                              }
                              isActive={isActiveMetric(metric)}
                              error={error}
                              label={metric.label}
                            />
                          )
                        })}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </Panel.Content>
    </Panel>
  )
}

export default graphql(PROJECT_METRICS_BY_SLUG_QUERY, {
  props: ({
    data: {
      loading,
      project: {
        availableMetrics = [],
        availableQueries = [],
        marketSegments = []
      } = {}
    },
    ownProps: { hiddenMetrics }
  }) => {
    const categories = getCategoryGraph(
      availableQueries
        .concat(availableMetrics)
        .concat(marketSegments.map(getMarketSegment)),
      hiddenMetrics
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
