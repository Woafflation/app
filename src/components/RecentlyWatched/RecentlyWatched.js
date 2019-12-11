import React, { useEffect } from 'react'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ProjectIcon from '../ProjectIcon'
import PercentChanges from '../PercentChanges'
import WatchlistCard from '../Watchlists/WatchlistCard'
import Skeleton from '../Skeleton/Skeleton'
import { store } from '../../index'
import {
  RECENT_ASSETS_FETCH,
  RECENT_WATCHLISTS_FETCH
} from '../../actions/types'
import { getRecentAssets, getRecentWatchlists } from '../../utils/recent'
import { formatNumber } from '../../utils/formatting'
import { getWatchlistLink } from '../../ducks/Watchlists/watchlistUtils'
import styles from './RecentlyWatched.module.scss'

export const Asset = ({ project, classes = {}, onClick }) => {
  const { name, ticker, priceUsd, percentChange24h, slug } = project
  const res = onClick
    ? { Component: 'div', props: { onClick: () => onClick(project) } }
    : { Component: Link, props: { to: `/projects/${slug}` } }
  return (
    <res.Component className={cx(styles.item, classes.asset)} {...res.props}>
      <div className={styles.group}>
        <ProjectIcon size={20} name={name} />
        <h3 className={cx(styles.name, classes.asset__name)}>
          {name} <span className={styles.ticker}>{ticker}</span>
        </h3>
      </div>
      <div className={styles.group}>
        <h4 className={styles.price}>
          {priceUsd ? formatNumber(priceUsd, { currency: 'USD' }) : 'No data'}
        </h4>
        <PercentChanges changes={percentChange24h} className={styles.change} />
      </div>
    </res.Component>
  )
}

const RecentlyWatched = ({
  className = '',
  assets,
  watchlists,
  onProjectClick,
  onWatchlistClick,
  type,
  classes = {}
}) => {
  const isShowAssets = type === 'assets' || !type
  const isShowWatchlists = type === 'watchlists' || !type

  const assetsNumber = getRecentAssets().filter(Boolean).length
  const watchlistsNumber = getRecentWatchlists().filter(Boolean).length

  useEffect(() => {
    if (!type) {
      store.dispatch({ type: RECENT_ASSETS_FETCH })
      store.dispatch({ type: RECENT_WATCHLISTS_FETCH })
    } else if (isShowAssets) {
      store.dispatch({ type: RECENT_ASSETS_FETCH })
    } else if (isShowWatchlists) {
      store.dispatch({ type: RECENT_WATCHLISTS_FETCH })
    }
  }, [])
  const hasAssets = assets && assets.length > 0 && isShowAssets
  const hasWatchlists = watchlists && watchlists.length > 0 && isShowWatchlists
  return (
    <>
      {isShowAssets && assetsNumber > 0 && (
        <div className={cx(className, styles.wrapper)}>
          <h2 className={cx(styles.title, classes.subTitle)}>
            Recently watched assets
          </h2>
          <Skeleton
            className={styles.skeleton}
            show={!hasAssets}
            repeat={assetsNumber}
          />
          {assets &&
            assets.map(project => (
              <Asset
                key={project.slug}
                project={project}
                onClick={onProjectClick}
                classes={classes}
              />
            ))}
        </div>
      )}
      {isShowWatchlists && watchlistsNumber > 0 && (
        <div className={cx(className, styles.wrapper)}>
          <h2 className={cx(styles.title, classes.subTitle)}>
            Recently watched watchlists
          </h2>
          <div className={styles.watchlistsWrapper}>
            <Skeleton
              className={styles.skeleton}
              show={!hasWatchlists}
              repeat={watchlistsNumber}
            />
            {watchlists &&
              watchlists.map(watchlist => (
                <WatchlistCard
                  isSimplifiedView={true}
                  key={watchlist.name}
                  watchlist={watchlist}
                  name={watchlist.name}
                  to={getWatchlistLink(watchlist)}
                  slugs={watchlist.listItems.map(({ project }) => project.slug)}
                  onClick={onWatchlistClick}
                />
              ))}
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = ({ recents }) => ({
  assets: recents.assets,
  watchlists: recents.watchlists
})

export default connect(mapStateToProps)(RecentlyWatched)
