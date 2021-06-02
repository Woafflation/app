import React from 'react'
import Icon from '@santiment-network/ui/Icon'
import { withExternal } from './utils'
import TopExchangesTable from '../../../components/Tables/TopExchanges'
import styles from '../index.module.scss'

const Widget = withExternal(TopExchangesTable)
const TopExchangesTableWidget = ({ target, widget, settings }) => (
  <Widget
    target={target}
    slug={settings.slug}
    titleClassName={styles.exchanges__title}
    titleChildren={
      <Icon
        type='close-medium'
        className={styles.close}
        onClick={widget.delete}
      />
    }
  />
)

export default TopExchangesTableWidget
