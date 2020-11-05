import React from 'react'
import cx from 'classnames'
import BaseActions from '../WatchlistBaseActions'
import Share from '../../../Actions/Share'
import WeeklyReportTrigger from '../../../Actions/WeeklyReport/Trigger'
import styles from '../index.module.scss'

const TopPanel = ({
  name,
  id,
  watchlist,
  isAuthor,
  className,
  isMonitored,
  ...props
}) => {
  return (
    <section className={cx(styles.wrapper, className)}>
      <div className={styles.row}>
        <h1 className={styles.name}>{name}</h1>
        {isAuthor && (
          <BaseActions
            isAuthor={isAuthor}
            name={name}
            id={id}
            watchlist={watchlist}
          />
        )}
      </div>
      <div className={styles.row}>
        <Share watchlist={watchlist} isAuthor={isAuthor} />
        {isAuthor && (
          <WeeklyReportTrigger id={id} name={name} isMonitored={isMonitored} />
        )}
      </div>
    </section>
  )
}

export default TopPanel
