import React from 'react'
import { Query } from '@apollo/react-components'
import UpgradeBtn from '../../../../components/UpgradeBtn/UpgradeBtn'
import { USER_SUBSCRIPTIONS_QUERY } from '../../../../queries/plans'
import { getCurrentSanbaseSubscription } from '../../../../utils/plans'
import { PRO } from '../../../../components/Navbar/NavbarProfileDropdown'
import Panel from '@santiment-network/ui/Panel/Panel'
import proIcon from './../../../../assets/feed/pro-icon.svg'
import externalStyles from './../FeedItemRenderer/FeedItemRenderer.module.scss'
import styles from './MakeProSubscriptionCard.module.scss'

const MakeProSubscriptionCard = () => {
  return (
    <Query query={USER_SUBSCRIPTIONS_QUERY}>
      {({ loading, data: { currentUser = {} } = {} }) => {
        if (loading) {
          return 'Loading...'
        }

        const sanbaseSubscription = getCurrentSanbaseSubscription(currentUser)

        const isProSanbase =
          sanbaseSubscription && sanbaseSubscription.plan
            ? sanbaseSubscription.plan.name === PRO
            : false

        if (isProSanbase) {
          return null
        }

        return (
          <Panel padding className={externalStyles.card}>
            <img src={proIcon} alt='pro-icon' className={styles.icon} />

            <div className={styles.center}>
              <div>Go PRO and get more data</div>
              <div className={styles.description}>
                Unlimited metrics, all types of signals, handcrafted report and
                much more
              </div>
            </div>

            <div className={styles.right}>
              <UpgradeBtn className={styles.upgrade} variant='fill' />
            </div>
          </Panel>
        )
      }}
    </Query>
  )
}

export default MakeProSubscriptionCard
