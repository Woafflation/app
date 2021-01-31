import React, { useMemo, useState, useEffect } from 'react'
import cx from 'classnames'
import isEqual from 'lodash.isequal'
import Button from '@santiment-network/ui/Button'
import Panel from '@santiment-network/ui/Panel'
import Icon from '@santiment-network/ui/Icon'
import ContextMenu from '@santiment-network/ui/ContextMenu'
import Category from './Category'
import { buildColumns, Column } from '../builder'
import { metrics } from '../../../Filter/dataHub/metrics'
import { useRestrictedMetrics } from '../../../../gql/hooks'
import { getCategoryGraph } from '../../../../../Studio/Sidebar/utils'
import { DEFAULT_ACTIVE_COLUMNS_KEYS } from '../defaults'
import { useTheme } from '../../../../../../stores/ui/theme'
import { getShadowVars } from '../../../../../../utils/styles'
import styles from './index.module.scss'

const Toggler = ({ activeColumns, updateActiveColumsKeys }) => {
  const { isNightMode } = useTheme()
  const [open, setOpen] = useState(false)
  const { allMetrics, restrictedMetrics } = useRestrictedMetrics()
  const [activeKeys, setActiveKeys] = useState([])
  const [currActiveKeys, setCurrActiveKeys] = useState([])

  useEffect(
    () => {
      const updatedActiveKeys = activeColumns.map(({ key }) => key)
      if (!isEqual(updatedActiveKeys, activeKeys) && !open) {
        setActiveKeys(updatedActiveKeys)
      }
    },
    [activeColumns]
  )

  useEffect(
    () => {
      setCurrActiveKeys(activeKeys)
      if (!open) {
        updateActiveColumsKeys(activeKeys)
      }
    },
    [open]
  )

  const categories = useMemo(
    () => {
      if (allMetrics.length !== 0) {
        updateActiveColumsKeys(DEFAULT_ACTIVE_COLUMNS_KEYS)
        buildColumns(metrics, allMetrics, restrictedMetrics)
        const allColumns = Object.values(Column)
        return getCategoryGraph(allColumns)
      }

      return []
    },
    [allMetrics]
  )

  function toggleColumn (columnKey, isActive) {
    const newActiveKeys = isActive
      ? [...activeKeys, columnKey]
      : activeKeys.filter(key => key !== columnKey)
    setActiveKeys(newActiveKeys)
  }

  return (
    <ContextMenu
      trigger={
        <Button
          fluid
          variant='flat'
          className={cx(styles.button, styles.button__withLine)}
        >
          <Icon type='columns' />
        </Button>
      }
      open={open}
      passOpenStateAs='isActive'
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      position='bottom'
      align='end'
    >
      <Panel
        variant='modal'
        className={styles.wrapper}
        style={getShadowVars(isNightMode)}
      >
        <div className={styles.content}>
          <Category
            key='Active columns'
            title='Active columns'
            columns={activeColumns}
            onColumnToggle={toggleColumn}
            activeKeys={currActiveKeys}
          />
          {Object.keys(categories).map(key => (
            <Category
              key={key}
              title={key}
              groups={categories[key]}
              onColumnToggle={toggleColumn}
              activeKeys={currActiveKeys}
            />
          ))}
        </div>
      </Panel>
    </ContextMenu>
  )
}

export default Toggler
