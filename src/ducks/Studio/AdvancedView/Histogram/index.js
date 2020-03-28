import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import Loader from '@santiment-network/ui/Loader/Loader'
import Dropdown from '@santiment-network/ui/Dropdown'
import Message from '@santiment-network/ui/Message'
import { useHistogramData } from './hooks'
import UsageTip from '../UsageTip'
import Calendar from '../Calendar'
import { usdFormatter } from '../../../SANCharts/utils'
import { millify } from '../../../../utils/formatting'
import { ONE_MONTH_IN_MS } from '../../../../utils/dates'
import UpgradeBtn from '../../../../components/UpgradeBtn/UpgradeBtn'
import styles from './index.module.scss'

const dropdownClasses = {
  wrapper: styles.dropdown,
  options: styles.dropdown__options
}

const TIME = 'Time'
const VALUE = 'Value'
const SORTER_OPTIONS = [TIME, VALUE]

const dateSorter = ({ index: a }, { index: b }) => a - b
const valueSorter = ({ width: a }, { width: b }) => b - a

const Sorter = {
  [TIME]: dateSorter,
  [VALUE]: valueSorter
}

function rangeFormatter ([left, right]) {
  return usdFormatter(left) + ' - ' + usdFormatter(right)
}

const Frame = ({ range, value, ticker, width, price, isRed }) => {
  return (
    <div className={styles.frame}>
      <div
        className={cx(styles.bar, !price && isRed && styles.red)}
        style={{ '--r': width }}
      />
      <div className={styles.info}>
        <span className={styles.range}>{rangeFormatter(range)}: </span>
        {millify(value, 1)} {ticker}
        {price && (
          <div className={styles.price}>
            Current price: {usdFormatter(price)}
          </div>
        )}
      </div>
    </div>
  )
}

const Histogram = ({ title, slug, ticker, date, datesRange, hasSort }) => {
  const [dates, setDates] = useState([date])
  const [sorter, setSorter] = useState(TIME)
  const [from, to] = dates
  const [data, loading, error] = useHistogramData({ slug, from, to })

  useEffect(
    () => {
      const to = new Date(date)
      to.setHours(23, 59, 59, 0)

      setDates([date, to])
    },
    [date]
  )

  useEffect(
    () => {
      if (datesRange) {
        setDates(datesRange)
      }
    },
    [datesRange]
  )

  function onCalendarChange (newDates) {
    setDates(newDates)
  }

  let isBucketAfterCurrentPrice = false

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        Spent coin cost
        <Calendar
          className={styles.calendar}
          selectRange
          dates={dates}
          onChange={onCalendarChange}
        />
      </h2>

      {hasSort && (
        <div className={styles.sorter}>
          Sort by
          <Dropdown
            selected={sorter}
            options={SORTER_OPTIONS}
            classes={dropdownClasses}
            onSelect={setSorter}
          />
        </div>
      )}

      <div className={styles.description}>
        It shows the cost of the coins that were spent during that day (time
        interval)
      </div>

      <UsageTip />

      <div className={styles.static}>
        <div className={styles.scroller}>
          <div className={styles.scroll}>
            {error ? (
              <Message variant='warn' className={styles.msg}>
                <p>Selected date is outside of the allowed interval.</p>
                <p>
                  Your current subscription plan allows you to see data from 10
                  Mar, 20 to 26 Mar, 20.
                </p>
                <UpgradeBtn className={styles.upgrade} variant='fill' />
              </Message>
            ) : (
              data
                .sort(Sorter[sorter])
                .map(({ index, distribution, width, price }) => {
                  if (price) {
                    isBucketAfterCurrentPrice = true
                  }
                  return (
                    <Frame
                      {...distribution}
                      key={index}
                      ticker={ticker}
                      width={width}
                      price={price}
                      isRed={isBucketAfterCurrentPrice}
                    />
                  )
                })
            )}
          </div>
        </div>

        {loading && <Loader className={styles.loader} />}
      </div>
    </div>
  )
}

Histogram.Icon = 'H'

Histogram.defaultProps = {
  date: new Date(Date.now() - ONE_MONTH_IN_MS * 3),
  slug: 'bitcoin',
  distributions: []
}

export default Histogram
