import React from 'react'
import cx from 'classnames'
import PageLoader from '../../components/Loader/PageLoader'
import TopPanel from './TopPanel'
import GetAssets from '../assets/GetAssets'
import { getWatchlistName } from '../assets/utils'
import AssetsTable from '../assets/AssetsTable'
import { ASSETS_TABLE_COLUMNS } from '../assets/asset-columns'
import styles from './index.module.scss'

const Screener = props => {
  return (
    <div className={('page', styles.container)}>
      <GetAssets
        {...props}
        type={props.type}
        render={Assets => {
          const title = getWatchlistName(props)
          const {
            typeInfo: { listId },
            isLoading,
            isCurrentUserTheAuthor,
            isPublicWatchlist,
            items = []
          } = Assets

          return (
            <>
              <TopPanel name={title || props.name} />
              {isLoading && <PageLoader />}

              {!isLoading && items.length > 0 && (
                <AssetsTable
                  Assets={Assets}
                  items={items}
                  classes={{ container: styles.tableWrapper }}
                  className={styles.table}
                  goto={props.history.push}
                  preload={props.preload}
                  listName={title}
                  allColumns={ASSETS_TABLE_COLUMNS}
                />
              )}
            </>
          )
        }}
      />
    </div>
  )
}

export default Screener
