import React, { useCallback, useState } from 'react'
import {
  getWatchlistName,
  DEFAULT_SCREENER_FUNCTION
} from '../../ducks/Watchlists/utils'
import { getProjectsByFunction } from '../../ducks/Watchlists/gql/hooks'
import TopPanel from '../../ducks/Watchlists/Widgets/TopPanel'
import GetAssets from '../../ducks/Watchlists/Widgets/Table/GetAssets'
import AssetsTable from '../../ducks/Watchlists/Widgets/Table/AssetsTable'
import { ASSETS_TABLE_COLUMNS } from '../../ducks/Watchlists/Widgets/Table/columns'
import ProjectsTreeMap from '../../ducks/Watchlists/Widgets/VolumeChart/ProjectsTreeMap'
import ProjectsChart from '../../ducks/Watchlists/Widgets/VolumeChart/ProjectsChart'
import { RANGES } from '../../ducks/Watchlists/Widgets/VolumeChart/utils'
import { addOrRemove } from '../../ducks/Watchlists/Widgets/Table/CompareDialog/CompareDialog'
import styles from './Screener.module.scss'

export const useComparingAssets = () => {
  const [comparingAssets, setComparingAssets] = useState([])
  const addAsset = useCallback(
    item => {
      setComparingAssets(
        addOrRemove(comparingAssets, item, ({ id }) => id === item.id)
      )
    },
    [comparingAssets, setComparingAssets]
  )

  return {
    comparingAssets,
    addAsset
  }
}

const Screener = props => {
  const [isPriceChartActive, setPriceChart] = useState(false)
  const [isPriceTreeMap, setPriceTreeMap] = useState(false)
  const [isVolumeTreeMap, setVolumeTreeMap] = useState(false)
  const [screenerFunction, setScreenerFunction] = useState(
    props.watchlist.function || DEFAULT_SCREENER_FUNCTION
  )
  const [assets = [], loading] = getProjectsByFunction(screenerFunction)

  const {
    watchlist,
    name,
    isLoggedIn,
    isDefaultScreener,
    history,
    preload
  } = props

  const { comparingAssets, addAsset } = useComparingAssets()

  return (
    <div className={('page', styles.screener)}>
      <GetAssets
        {...props}
        type={props.type}
        render={Assets => {
          const title = getWatchlistName(props)
          const {
            typeInfo: { listId },
            isCurrentUserTheAuthor
          } = Assets

          return (
            <>
              <TopPanel
                name={(watchlist || {}).name || name}
                id={listId}
                assets={assets}
                loading={loading}
                watchlist={watchlist}
                isAuthor={isCurrentUserTheAuthor}
                isLoggedIn={isLoggedIn}
                screenerFunction={screenerFunction}
                setScreenerFunction={setScreenerFunction}
                isDefaultScreener={isDefaultScreener}
                history={history}
                widgets={{
                  isPriceChart: isPriceChartActive,
                  isPriceTreeMap: isPriceTreeMap,
                  isVolumeTreeMap: isVolumeTreeMap
                }}
                togglers={{
                  priceToggle: setPriceChart,
                  togglePriceTreeMap: setPriceTreeMap,
                  toggleVolumeTreeMap: setVolumeTreeMap
                }}
              />
              {isPriceTreeMap && (
                <div className={styles.treeMaps}>
                  <ProjectsTreeMap
                    className={styles.containerTreeMap}
                    assets={assets}
                    title='Price changes'
                    ranges={RANGES}
                    loading={loading}
                  />
                </div>
              )}
              {isPriceChartActive && (
                <ProjectsChart loading={loading} assets={assets} />
              )}
              <AssetsTable
                Assets={{ ...Assets, isLoading: loading }}
                items={assets}
                type='screener'
                isAuthor={isCurrentUserTheAuthor}
                watchlist={watchlist}
                classes={{ container: styles.tableWrapper, top: styles.top }}
                className={styles.table}
                goto={history.push}
                history={history}
                preload={preload}
                listName={title}
                allColumns={ASSETS_TABLE_COLUMNS}
                compareSettings={{
                  comparingAssets,
                  addAsset
                }}
              />
            </>
          )
        }}
      />
    </div>
  )
}

export default Screener
