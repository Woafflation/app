import React, { useState, useRef } from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import withMetrics from '../../withMetrics'
import { getCategoryGraph } from '../../Sidebar/utils'
import Search, { getMetricSuggestions } from '../../Sidebar/Search'
import MetricIcon from '../../../SANCharts/MetricIcon'
import { COLORS } from '../../../Chart/colors'
import styles from './Metric.module.scss'

const DEFAULT_COLOR = '#9faac4'

const CustomProjectCategories = {
  gold: getCategoryGraph(['price_usd']),
  's-and-p-500': getCategoryGraph(['price_usd'])
}

const MetricSearch = withMetrics(
  ({ slug, categories, loading, className, ...rest }) => (
    <Search
      {...rest}
      className={cx(className, loading && styles.loading)}
      categories={CustomProjectCategories[slug] || categories}
      emptySuggestions={getMetricSuggestions(
        CustomProjectCategories[slug] || categories
      )}
      inputProps={{
        placeholder: 'Type to search metrics...'
      }}
    />
  )
)

const Label = ({ comparable, editMetric, colors, options }) => {
  const { node, label } = comparable.metric
  const color = options.isMultiChartsActive ? COLORS[0] : colors[comparable.key]

  return (
    <div className={styles.selected} onClick={editMetric}>
      <MetricIcon
        node={node}
        color={color || DEFAULT_COLOR}
        className={styles.label}
      />
      {label}
      <Icon type='edit' className={styles.edit} />
    </div>
  )
}

export default ({
  comparable,
  slug,
  colors,
  hiddenMetrics,
  onSelect,
  ...rest
}) => {
  const [isEditing, setEditing] = useState()
  const metricSelectorRef = useRef(null)

  function onMetricSelect (metric) {
    if (comparable) {
      stopEditing()
    }

    return onSelect(metric)
  }

  function editMetric () {
    setEditing(true)
    metricSelectorRef.current.firstElementChild.firstElementChild.focus()
  }

  function stopEditing () {
    setEditing()
  }

  return (
    <div className={styles.metric} ref={metricSelectorRef}>
      <MetricSearch
        noMarketSegments
        slug={slug}
        hiddenMetrics={hiddenMetrics}
        toggleMetric={onMetricSelect}
        onBlur={stopEditing}
      />
      {isEditing ||
        (comparable && (
          <Label
            {...rest}
            comparable={comparable}
            editMetric={editMetric}
            colors={colors}
          />
        ))}
    </div>
  )
}
