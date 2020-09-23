import React from 'react'
import { Link } from 'react-router-dom'
import withSizes from 'react-sizes'
import Dialog from '@santiment-network/ui/Dialog'
import { mapSizesToProps } from '../../utils/withSizes'
import HistoricalBalancePage, {
  BalancePageTitle
} from '../../ducks/HistoricalBalance/page/HistoricalBalancePage'
import { formIntervalSettings } from '../../ducks/SANCharts/IntervalSelector'
import styles from './WalletLink.module.scss'
import dialogStyles from './ViewBalanceDialog.module.scss'

const CHART_SETTINGS = {
  ...formIntervalSettings('7d'),
  timeRange: '7d'
}

const SETTINGS = {}

const ViewBalanceDialog = ({
  isDesktop,
  address,
  assets,
  trigger,
  priceMetrics
}) => {
  return (
    <Dialog
      title={<BalancePageTitle classes={dialogStyles} />}
      trigger={<div>{trigger || <BalancePageLink link='#' />}</div>}
      classes={dialogStyles}
    >
      <Dialog.ScrollContent>
        <HistoricalBalancePage
          priceMetrics={priceMetrics}
          classes={dialogStyles}
          isDesktop={isDesktop}
          address={address}
          assets={assets}
          showTitle={false}
          chartSettings={CHART_SETTINGS}
          settings={SETTINGS}
        />
      </Dialog.ScrollContent>
    </Dialog>
  )
}

const BalancePageLink = ({ link }) => {
  return (
    <Link to={link} className={styles.link}>
      Show historical balance
    </Link>
  )
}

export default withSizes(mapSizesToProps)(ViewBalanceDialog)
