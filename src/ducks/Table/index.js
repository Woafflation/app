import React from 'react'
import cx from 'classnames'
import { useTable, useSortBy, usePagination } from 'react-table'
import { sortDate } from '../../utils/sortMethods'
import Loader from './Loader'
import NoData from './NoData'
import Pagination from './Pagination'
import styles from './index.module.scss'

const Table = ({
  data,
  columns,
  options: {
    loadingSettings,
    sortingSettings,
    stickySettings,
    paginationSettings
  } = {},
  className,
  classes = {}
}) => {
  const { isLoading, repeatLoading } = loadingSettings || {}
  const { allowSort, defaultSorting } = sortingSettings || {}
  const { isStickyHeader, isStickyColumn, stickyColumnIdx = null } =
    stickySettings || {}
  const {
    pageSize: initialPageSize,
    pageIndex: initialPageIndex,
    pageSizeOptions = [10, 25, 50]
  } = paginationSettings || {}

  const initialState = {}

  if (defaultSorting) {
    initialState.sortBy = defaultSorting
  }

  if (initialPageSize) {
    initialState.pageSize = initialPageSize
  }

  if (initialPageIndex) {
    initialState.pageIndex = initialPageIndex
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      disableSortRemove: true,
      disableSortBy: !allowSort,
      sortTypes: {
        datetime: (a, b, id) => sortDate(a.original[id], b.original[id])
      },
      initialState
    },
    useSortBy,
    usePagination
  )

  const content = paginationSettings ? page : rows
  const paginationParams = {
    pageSize,
    pageOptions,
    pageIndex,
    canNextPage,
    canPreviousPage,
    setPageSize,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    pageSizeOptions
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        !paginationSettings && styles.wrapperOverflow,
        className
      )}
    >
      <table {...getTableProps()} className={cx(styles.table, classes.table)}>
        <thead className={cx(styles.header, classes.header)}>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className={cx(styles.headerRow, classes.headerRow)}
            >
              {headerGroup.headers.map((column, idx) => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps({ title: '' })
                  )}
                  className={cx(
                    styles.headerColumn,
                    column.isSorted && styles.headerColumnActive,
                    isStickyHeader && styles.headerColumnStickyTop,
                    isStickyColumn &&
                      stickyColumnIdx === idx &&
                      styles.headerColumnStickyLeft,
                    classes.headerColumn
                  )}
                >
                  <span>{column.render('Header')}</span>
                  <span
                    className={cx(
                      styles.sort,
                      column.isSortedDesc ? styles.sortDesc : styles.sortAsc
                    )}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className={cx(styles.body, classes.body)}
        >
          {content.map(row => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className={cx(styles.bodyRow, classes.bodyRow)}
              >
                {row.cells.map((cell, idx) => (
                  <td
                    {...cell.getCellProps()}
                    className={cx(
                      styles.bodyColumn,
                      isStickyColumn &&
                        stickyColumnIdx === idx &&
                        styles.bodyColumnSticky,
                      classes.bodyColumn
                    )}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!!loadingSettings && repeatLoading > 0 && (
        <Loader
          repeat={repeatLoading}
          isLoading={isLoading}
          classes={{ wrapper: classes.loader, row: classes.loaderRow }}
        />
      )}
      {!!loadingSettings && !isLoading && data.length === 0 && <NoData />}
      {!!paginationSettings && (
        <Pagination {...paginationParams} className={classes.pagination} />
      )}
    </div>
  )
}

export default Table
