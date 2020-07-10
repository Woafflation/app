import React from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import { InputWithIcon } from '@santiment-network/ui/Input'
import UpgradeBtn from '../../components/UpgradeBtn/UpgradeBtn'
import ProMetric from './ProMetric/ProMetric'
import { SECOND_METRICS_GROUP, THIRD_METRICS_GROUP } from './utils'
import { MobileOnly } from '../../components/Responsive'
import MobileHeader from '../../components/MobileHeader/MobileHeader'
import { FIRST_METRICS_GROUP } from './utils.js'
import CommonFooter from './ProMetricsFooter/CommonFooter'
import SubscriptionForm from '../../components/SubscriptionForm/SubscriptionForm'
import upgradeSvg from './../../assets/pro-metrics/upgrade.svg'
import signSvg from './../../assets/pro-metrics/sign-bg.svg'
import { useUserSubscriptionStatus } from '../../stores/user/subscriptions'
import styles from './ProMetrics.module.scss'

const ProMetrics = ({ history, isLoggedIn }) => {
  const { isPro } = useUserSubscriptionStatus()
  return (
    <div className={cx('page', styles.container)}>
      <div className={styles.inner}>
        <MobileOnly>
          <MobileHeader
            showBack={true}
            goBack={history.goBack}
            classes={styles}
          />
        </MobileOnly>

        <div className={styles.firstStep}>
          <div className={styles.descriptions}>
            <div className={styles.crown}>
              <Icon type='crown' /> Pro Google Sheets templates
            </div>

            <div className={styles.perksTitle}>
              The Perks of Being a Pro Subscriber on Sanbase
            </div>

            <div className={styles.description}>
              Next to many other perks, Sanbase Pro subscribers get access to
              exclusive templates, dynamic reports and market-beating indices
              developed by the Santiment team.
            </div>

            <div className={styles.description}>
              New Chart Layouts and indices are added monthly.
            </div>

            {!isPro && (
              <UpgradeBtn loginRequired={false} className={styles.upgradeBtn}>
                Upgrade
              </UpgradeBtn>
            )}
          </div>

          {FIRST_METRICS_GROUP.map((metric, index) => (
            <ProMetric
              isProSanbase={isPro}
              metric={metric}
              key={index}
              classes={{
                container: styles.firstGroup
              }}
            />
          ))}

          <div
            className={cx(styles.ask, styles.bgSvg)}
            style={{
              background: 'url(' + upgradeSvg + ') repeat-x bottom'
            }}
          >
            <div className={styles.askBlock}>
              <div className={styles.askTitle}>
                Convinced to upgrade already?
              </div>

              <UpgradeBtn className={styles.askUpgradeBtn} />
            </div>
          </div>

          <div className={styles.row}>
            {SECOND_METRICS_GROUP.map((metric, index) => (
              <ProMetric
                isProSanbase={isPro}
                metric={metric}
                key={index}
                classes={{
                  container: styles.secondGroup,
                  svg: styles.secondGroupSvg
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.secondStep}>
          <div className={styles.grid}>
            {THIRD_METRICS_GROUP.map((metric, index) => (
              <ProMetric
                isProSanbase={isPro}
                metric={metric}
                key={index}
                classes={{
                  container: styles.thirdGroup,
                  svg: styles.thirdGroupSvg
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {!isLoggedIn && (
        <div
          className={cx(styles.ask, styles.bgSvg, styles.signSvg)}
          style={{
            background: 'url(' + signSvg + ') repeat-x bottom'
          }}
        >
          <div className={cx(styles.askBlock, styles.askAccount)}>
            <div className={cx(styles.askTitle, styles.sign)}>
              Don’t have an account? Sign up now!
            </div>

            <SubscriptionForm
              classes={styles}
              inputEl={InputWithIcon}
              icon='mail'
              iconPosition='left'
              hasSubscribed={false}
              subscriptionLabel='Send me weekly updates from crypto market'
            />
          </div>
        </div>
      )}

      <CommonFooter />
    </div>
  )
}

export default ProMetrics
