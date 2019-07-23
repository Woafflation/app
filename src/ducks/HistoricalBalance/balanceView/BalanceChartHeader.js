import React from 'react'
import ShowIf from '../../../components/ShowIf'
import SignalMasterModalForm from '../../Signals/signalModal/SignalMasterModalForm'
import {
  ETH_WALLET_AMOUNT_UP,
  ETH_WALLET_METRIC
} from '../../Signals/utils/constants'
import { mapToOptions } from '../../Signals/utils/utils'
import styles from './BalanceView.module.scss'

const BalanceChartHeader = ({ address, assets, children }) => {
  return (
    <div className={styles.chartHeader}>
      <div className={styles.addTrigger}>
        <ShowIf beta>
          <SignalMasterModalForm
            label='Generate signal'
            enabled={address && assets && assets.length > 0}
            canRedirect={false}
            metaFormSettings={{
              target: {
                value: mapToOptions(assets)
              },
              metric: {
                value: { ...ETH_WALLET_METRIC }
              },
              type: {
                value: { ...ETH_WALLET_AMOUNT_UP }
              },
              ethAddress: address
            }}
            buttonParams={{
              variant: 'ghost',
              border: true
            }}
          />
        </ShowIf>
      </div>

      <div className={styles.chartParams}>{children}</div>
    </div>
  )
}

export default BalanceChartHeader
