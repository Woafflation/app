import React, { useState, useMemo } from 'react'
import cx from 'classnames'
import { Checkbox } from '@santiment-network/ui/Checkboxes'
import Chart from './Chart'
import Actions from './Actions'
import Page from '../../ducks/Page'
import { prepareColumns } from '../../ducks/_Table'
import PagedTable from '../../ducks/_Table/Paged'
import {
  useAddressWatchlist,
  useIsWatchlistAuthor,
  useAddressWatchlistItems
} from './hooks'
import {
  Label,
  CollapsedLabels
} from '../../ducks/HistoricalBalance/Address/Labels'
import ValueChange from '../../components/ValueChange/ValueChange'
import PageLoader from '../../components/Loader/PageLoader'
import styles from './index.module.scss'
import SaveAs from './SaveAs'
import Copy from './Copy'
import { parseUrl } from './url'

const balanceValue = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2
})

const Labels = ({ labels }) => {
  const visibleLabels = labels.slice(0, 2)
  const hiddenLabels = labels.slice(2)

  return (
    <div className={styles.labels}>
      {visibleLabels.map(Label)}
      {!!hiddenLabels.length && <CollapsedLabels labels={hiddenLabels} />}
    </div>
  )
}

const COLUMNS = prepareColumns([
  {
    id: 'CHECKBOX',
    Title: ({ selectAll, isAllItemSelected }) => (
      <Checkbox onClick={selectAll} isActive={isAllItemSelected} />
    ),
    render: (item, { selectItem, selectedItemsSet }) => (
      <Checkbox
        onClick={() => selectItem(item)}
        isActive={selectedItemsSet.has(item)}
      />
    ),
    className: styles.checkbox
  },
  {
    title: '#',
    render: (_, __, i) => i + 1,
    className: styles.index
  },
  {
    title: 'Transaction address',
    render: ({ address }) => address
  },
  {
    title: 'Current balance',
    render: ({ balanceChange }) =>
      balanceChange && balanceValue.format(balanceChange.balanceEnd)
  },
  {
    title: 'Balance, 7d, %',
    render: ({ balanceChange }) =>
      balanceChange && (
        <ValueChange change={balanceChange.balanceChangePercent} />
      )
  },
  {
    title: 'Balance, 7d',
    render: ({ address, balanceChange }) =>
      balanceChange && (
        <Chart address={address} change={balanceChange.balanceChangePercent} />
      )
  },
  {
    title: 'Labels',
    render: Labels
  }
])

const SET = new Set()
function useSelectedItemsSet (items) {
  const [selectedItemsSet, setSelectedItemsSet] = useState(SET)

  function selectItem (item) {
    const newState = new Set(selectedItemsSet)

    if (newState.has(item)) {
      newState.delete(item)
    } else {
      newState.add(item)
    }

    setSelectedItemsSet(newState)
  }

  function selectAll () {
    setSelectedItemsSet(
      selectedItemsSet.size === items.length ? SET : new Set(items)
    )
  }

  return {
    selectedItemsSet,
    selectItem,
    selectAll,
    isAllItemSelected: selectedItemsSet.size === items.length
  }
}

const WatchlistAddress = ({ match }) => {
  const { watchlist, isLoading } = useAddressWatchlist(parseUrl(match.params))
  const isAuthor = useIsWatchlistAuthor(watchlist)
  const items = useAddressWatchlistItems(watchlist)
  const obj = useSelectedItemsSet(items)

  if (isLoading) return <PageLoader />

  console.log(watchlist)

  return (
    <Page
      isWidthPadding={false}
      title={watchlist.name}
      actions={<Actions watchlist={watchlist} isAuthor={isAuthor} />}
    >
      <div className='top'>
        <SaveAs watchlist={watchlist} items={items} />
        <Copy watchlist={watchlist} />
      </div>
      <PagedTable
        className={styles.table}
        columns={COLUMNS}
        items={items}
        itemKeyProperty='address'
        itemProps={obj}
        isLoading={isLoading}
      />
    </Page>
  )
}

export default WatchlistAddress
