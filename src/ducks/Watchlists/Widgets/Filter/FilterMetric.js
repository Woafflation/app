import React, { useState, useEffect } from 'react'
import { Checkbox } from '@santiment-network/ui/Checkboxes'
import Input from '@santiment-network/ui/Input'
import Button from '@santiment-network/ui/Button'
import OperatorMenu from './operators/OperatorMenu'
import {
  Operator,
  defaultMetricFormatter,
  defaultValueFormatter,
  DEFAULT_TIMERANGES
} from './operators/index'
import { useDebounce } from '../../../../hooks'
import styles from './FilterMetric.module.scss'

function getInitialOperator ({ metricFilters, isPercentMetric }) {
  const initialOperators = metricFilters.map(({ operator }) => operator)

  if (initialOperators.length > 0) {
    return isPercentMetric
      ? `percent_${initialOperators[0]}`
      : initialOperators[0]
  }

  return Operator.greater_than.key
}

function getInitialThreshold ({ metricFilters, isPercentMetric }) {
  const thresholds = metricFilters.map(({ threshold }) => threshold)

  if (isNaN(thresholds[0])) {
    return ''
  }

  return isPercentMetric ? thresholds[0] * 100 : thresholds[0]
}

function getInitialTimeRange ({ metricFilters }) {
  if (metricFilters.length > 0) {
    return metricFilters[0].dynamicFrom
  }
  return '1d'
}

function getAvailableTimeRanges ({ key, availableMetrics }) {
  const metrics = availableMetrics.filter(metric =>
    metric.includes(`${key}_change_`)
  )
  const timeRanges = metrics.map(metric => metric.replace(`${key}_change_`, ''))

  return DEFAULT_TIMERANGES.filter(timeRange => timeRanges.includes(timeRange))
}

function checkIsPercentMetric ({ metricFilters }) {
  if (metricFilters.length > 0) {
    return metricFilters[0].metric.includes('_change_')
  }
  return false
}

const FilterMetric = ({
  metric,
  filter = [],
  isNoFilters,
  updMetricInFilter,
  isAuthor,
  availableMetrics
}) => {
  const metricFilters = filter.filter(item => item.metric.includes(metric.key))
  const isPercentMetric = checkIsPercentMetric({ metricFilters })
  const isActive = !!metricFilters.length
  const [isOpened, setIsOpened] = useState(isActive)
  const [timeRanges, setTimeRanges] = useState(
    getAvailableTimeRanges({
      key: metric.key,
      availableMetrics
    })
  )
  const [timeRange, setTimeRange] = useState(
    getInitialTimeRange({ metricFilters })
  )
  const [operator, setOperator] = useState(
    getInitialOperator({ metricFilters, isPercentMetric })
  )
  const [firstInputValue, setFirstInputValue] = useState(
    getInitialThreshold({ metricFilters, isPercentMetric })
  )

  const onMetricUpdateDebounced = useDebounce(
    value => onMetricUpdate(value),
    800
  )

  useEffect(
    () => {
      if (isNoFilters) {
        setIsOpened(false)
        setFirstInputValue('')
        setOperator(Operator.greater_than.key)
      }
    },
    [isNoFilters]
  )

  useEffect(
    () => {
      if (timeRanges.length === 0) {
        const timeRanges = getAvailableTimeRanges({
          key: metric.key,
          availableMetrics
        })
        setTimeRanges(timeRanges)
      }
    },
    [availableMetrics]
  )

  const { key, label } = metric

  function onCheckboxClicked () {
    if (!isAuthor) {
      return null
    }

    setIsOpened(!isOpened)
  }

  function onOperatorChange (operator) {
    if (!isAuthor) {
      return null
    }

    setOperator(operator)
    if (firstInputValue) {
      onMetricUpdate({
        operator,
        threshold: firstInputValue
      })
    }
  }

  function onMetricUpdate (props) {
    const {
      key,
      dataKey = key,
      metricFormatter = defaultMetricFormatter,
      serverValueFormatter = defaultValueFormatter
    } = Operator[props.operator || operator]
    updMetricInFilter({
      aggregation: 'last',
      dynamicFrom: props.timeRange || timeRange,
      dynamicTo: 'now',
      metric: metricFormatter({
        metric: metric.key,
        timeRange: props.timeRange || timeRange
      }),
      operator: dataKey,
      threshold: serverValueFormatter(props.threshold || firstInputValue)
    })
  }

  function onFirstInputChange ({ currentTarget: { value } }) {
    const newValue = isNaN(parseFloat(value)) ? '' : parseFloat(value)
    setFirstInputValue(newValue)
    onMetricUpdateDebounced({ threshold: newValue })
  }

  function toggleTimeRange (timeRange) {
    const activeIndex = timeRanges.indexOf(timeRange)
    const nextIndex = activeIndex + 1 >= timeRanges.length ? 0 : activeIndex + 1
    const nextTimeRange = timeRanges[nextIndex]
    setTimeRange(nextTimeRange)

    if (firstInputValue) {
      onMetricUpdate({ timeRange: nextTimeRange })
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Checkbox
          isActive={isOpened}
          onClick={onCheckboxClicked}
          className={styles.checkbox}
        />
        <span className={styles.label}>{label}</span>
      </div>
      {isOpened && (
        <div className={styles.settings}>
          <OperatorMenu
            operator={operator}
            onChange={onOperatorChange}
            showPercentFilters={timeRanges && timeRanges.length > 0}
          />
          <Input
            onChange={onFirstInputChange}
            disabled={!isAuthor}
            defaultValue={firstInputValue}
          />
          {/* {thresholds.length === 2 && ( */}
          {/*   <> */}
          {/*     <span className={styles.preposition}>to</span> */}
          {/*     <Input */}

          {/*       onBlur={onSecondInputChange} */}
          {/*       defaultValue={thresholds[1]} */}
          {/*     /> */}
          {/*   </> */}
          {/* )} */}
          {isPercentMetric && (
            <Button
              className={styles.timerange}
              border
              variant='flat'
              onClick={() => toggleTimeRange(timeRange)}
            >
              {timeRange}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterMetric
