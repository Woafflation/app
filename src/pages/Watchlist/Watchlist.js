import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import qs from 'query-string'
import { getOrigin } from '../../utils/utils'
import { useComparingAssets } from '../../ducks/Watchlists/Widgets/Table/CompareDialog/hooks'
import PageLoader from '../../components/Loader/PageLoader'
import GetAssets from '../../ducks/Watchlists/Widgets/Table/GetAssets'
import TopPanel from '../../ducks/Watchlists/Widgets/TopPanel'
import AssetsTable from '../../ducks/Watchlists/Widgets/Table/AssetsTable'
import {
  getHelmetTags,
  getWatchlistName,
  useScreenerUrl
} from '../../ducks/Watchlists/utils'
import AssetsTemplates from '../../ducks/Watchlists/Widgets/Table/AssetsTemplates'
import { ASSETS_TABLE_COLUMNS } from '../../ducks/Watchlists/Widgets/Table/columns'
import { useAssetsAnomalyToggler } from './hooks/useAssetsAnomalyToggler'
import { PROJECT } from '../../ducks/Watchlists/detector'
import { addRecentWatchlists } from '../../utils/recent'
import Infographics from './Infographics'
import styles from './Watchlist.module.scss'

const WatchlistPage = props => {
  const [currentItems, setCurrentItems] = useState([])
  const { type, location, history, watchlist } = props
  const { id, name } = watchlist || qs.parse(location.search)

  const isList = type === 'list'
  const { title, description } = getHelmetTags(isList, name)

  const {
    toggleAssetsFiltering,
    filteredItems,
    clearFilters,
    filterType
  } = useAssetsAnomalyToggler()

  const { comparingAssets, addAsset, cleanAll } = useComparingAssets()
  const { widgets, setWidgets } = useScreenerUrl({
    location,
    history,
    defaultParams: {
      isMovement: true
    }
  })

  return (
    <div className={('page', styles.watchlist)}>
      <Helmet>
        <link rel='canonical' href={`${getOrigin()}/assets`} />
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
      </Helmet>
      <GetAssets
        {...props}
        type={type}
        render={Assets => {
          const title = getWatchlistName(props)
          const {
            typeInfo: { listId },
            isLoading,
            isCurrentUserTheAuthor,
            isPublicWatchlist,
            items = [],
            trendingAssets = []
          } = Assets

          if (items !== currentItems) {
            setCurrentItems(items)
            clearFilters()
          }

          if (listId) {
            addRecentWatchlists(listId)
          }

          const showingAssets = filteredItems || items

          return (
            <>
              <TopPanel
                type={PROJECT}
                widgets={widgets}
                setWidgets={setWidgets}
                className={styles.top}
                watchlist={props.watchlist}
              />
              {isLoading && <PageLoader />}

              {!isLoading && items.length > 0 && (
                <>
                  <Infographics
                    type='Watchlist'
                    assets={showingAssets}
                    listId={id}
                    widgets={widgets}
                    setWidgets={setWidgets}
                    trendingAssets={trendingAssets}
                    toggleAssetsFiltering={toggleAssetsFiltering}
                    filterType={filterType}
                  />

                  <AssetsTable
                    Assets={Assets}
                    watchlist={props.watchlist}
                    filterType={filterType}
                    items={showingAssets}
                    goto={props.history.push}
                    type={PROJECT}
                    preload={props.preload}
                    listName={title}
                    allColumns={ASSETS_TABLE_COLUMNS}
                    compareSettings={{
                      comparingAssets,
                      addAsset,
                      cleanAll
                    }}
                  />
                </>
              )}
              {!isLoading && (
                <AssetsTemplates
                  items={items}
                  isAuthor={isCurrentUserTheAuthor}
                  isPublic={isPublicWatchlist}
                  listId={listId}
                  title={title}
                />
              )}
            </>
          )
        }}
      />
    </div>
  )
}

export default WatchlistPage
