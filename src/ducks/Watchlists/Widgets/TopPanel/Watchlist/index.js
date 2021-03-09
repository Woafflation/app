import React from 'react'
import cx from 'classnames'
import Title from '../Title'
import Widgets from '../Widgets'
import BaseActions from '../BaseActions'
import Share from '../../../Actions/Share'
import { PROJECT } from '../../../detector'
import { useIsAuthor } from '../../../gql/list/hooks'
import WeeklyReport from '../../../Actions/WeeklyReport'
import styles from '../index.module.scss'

const TopPanel = ({
  name,
  type,
  watchlist,
  className,
  widgets,
  setWidgets
}) => {
  const { isAuthor, isAuthorLoading } = useIsAuthor(watchlist)
  return (
    <section className={cx(styles.wrapper, className)}>
      <div className={styles.row}>
        <Title name={name} watchlist={watchlist} />
        <BaseActions
          isAuthor={isAuthor}
          isAuthorLoading={isAuthorLoading}
          watchlist={watchlist}
          type={type}
        />
      </div>
      <div className={styles.row}>
        {widgets && <Widgets widgets={widgets} setWidgets={setWidgets} />}
        {watchlist && <Share watchlist={watchlist} isAuthor={isAuthor} />}
        {isAuthor && type === PROJECT && <WeeklyReport watchlist={watchlist} />}
      </div>
    </section>
  )
}

export default TopPanel
