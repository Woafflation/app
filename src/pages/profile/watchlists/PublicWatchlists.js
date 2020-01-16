import React from 'react'
import WatchlistCards from '../../../components/Watchlists/WatchlistCards'
import styles from './../ProfilePage.module.scss'

const PublicWatchlists = ({ data: watchlists }) => {
  if (!watchlists || watchlists.length === 0) {
    return null
  }

  return (
    <div className={styles.block}>
      <WatchlistCards
        watchlists={watchlists}
        classes={styles}
        makeSharedLinks
      />
    </div>
  )
}

export default PublicWatchlists
