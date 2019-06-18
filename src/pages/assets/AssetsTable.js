import React, { useState } from 'react'
import ReactTable from 'react-table'
import cx from 'classnames'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import 'react-table/react-table.css'
import { ASSETS_FETCH, ASSETS_SET_MIN_VOLUME_FILTER } from '../../actions/types'
import Refresh from '../../components/Refresh/Refresh'
import ServerErrorMessage from './../../components/ServerErrorMessage'
import AssetsToggleColumns from './AssetsToggleColumns'
import columns, { columnSettingsDefault } from './asset-columns'
import './../Projects/ProjectsTable.css'
import styles from './AssetsTable.module.scss'

export const CustomHeadComponent = ({ children, className, ...rest }) => (
  <Sticky enabled>
    <div className={cx('rt-thead', className)} {...rest}>
      {children}
    </div>
  </Sticky>
)

export const filterColumns = (columns, settings) =>
  columns.filter(({ id }) => settings[id].show)

const AssetsTable = ({
  Assets = {
    items: [],
    isLoading: true,
    error: undefined,
    type: 'all'
  },
  showAll = false,
  preload,
  refetchAssets,
  setMinVolumeFilter,
  minVolume = 10000
}) => {
  const { isLoading, items, error, type } = Assets
  if (error && error.message !== 'Network error: Failed to fetch') {
    return <ServerErrorMessage />
  }

  const [columnsSettings, changeColumnsSettings] = useState(
    columnSettingsDefault
  )

  const toggleColumn = id =>
    changeColumnsSettings({
      ...columnsSettings,
      [id]: { ...columnsSettings[id], show: !columnsSettings[id].show }
    })

  return (
    <>
      <div className={styles.top}>
        <Refresh
          timestamp={Assets.timestamp}
          onRefreshClick={() =>
            refetchAssets({ ...Assets.typeInfo, minVolume })
          }
        />
        {
          // <Button
          // variant='fill'
          // accent={minVolume > 0 ? 'positive': ''}
          // onClick={setMinVolumeFilter}>
          // {minVolume > 0 ? `remove filter min volume > ${millify(minVolume, 2)}` : 'add filter min volume > 10k'}
          // </Button>
        }
        <AssetsToggleColumns
          columns={columnsSettings}
          onChange={toggleColumn}
        />
      </div>
      <ReactTable
        loading={isLoading}
        showPagination={!showAll}
        showPaginationTop={false}
        showPaginationBottom
        defaultPageSize={20}
        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
        pageSize={showAll ? items && items.length : undefined}
        sortable={false}
        resizable={false}
        defaultSorted={[
          {
            id: columnsSettings['marketcapUsd'].show
              ? 'marketcapUsd'
              : 'project',
            desc: false
          }
        ]}
        className={cx('-highlight', styles.assetsTable)}
        data={items}
        columns={filterColumns(columns(preload), columnsSettings)}
        loadingText='Loading...'
        TheadComponent={CustomHeadComponent}
        getTdProps={() => ({
          onClick: (e, handleOriginal) => {
            if (handleOriginal) handleOriginal()
          },
          style: { border: 'none' }
        })}
      />
    </>
  )
}

const mapStateToProps = state => {
  return {
    minVolume: state.projects.filters.minVolume
  }
}

const mapDispatchToProps = dispatch => ({
  refetchAssets: ({ type, listName, listId, minVolume = 10000 }) =>
    dispatch({
      type: ASSETS_FETCH,
      payload: {
        type,
        list: {
          name: listName,
          id: listId
        },
        filters: {
          minVolume
        }
      }
    }),
  setMinVolumeFilter: () =>
    dispatch({
      type: ASSETS_SET_MIN_VOLUME_FILTER
    })
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetsTable)
