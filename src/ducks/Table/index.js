import React from 'react'
import cx from 'classnames'
import { useTable, useSortBy } from 'react-table'
import { sortDate } from '../../utils/sortMethods'
import Loader from './Loader'
import styles from './index.module.scss'

const Table = ({
  columns,
  data,
  options = {},
  isLoading,
  repeatLoading = 0,
  className,
  classes = {}
}) => {
  const { withSorting, isStickyHeader, initialState = {}, ...rest } = options

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      disableSortRemove: true,
      disableSortBy: !withSorting,
      sortTypes: {
        datetime: (row1, row2, id) =>
          sortDate(row1.original[id], row2.original[id])
      },
      initialState,
      ...rest
    },
    useSortBy
  )

  return (
    <div className={cx(styles.wrapper, className)}>
      <table {...getTableProps()} className={cx(styles.table, classes.table)}>
        <thead className={cx(styles.header, classes.header)}>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className={cx(styles.headerRow, classes.headerRow)}
            >
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps({ title: '' })
                  )}
                  className={cx(
                    styles.headerColumn,
                    column.isSorted && styles.headerColumnActive,
                    isStickyHeader && styles.headerColumnSticky,
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
          {repeatLoading && (
            <Loader
              repeat={repeatLoading}
              isLoading={isLoading}
              classes={{ wrapper: classes.loader, row: classes.loaderRow }}
            />
          )}
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className={cx(styles.bodyRow, classes.bodyRow)}
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={cx(styles.bodyColumn, classes.bodyColumn)}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
