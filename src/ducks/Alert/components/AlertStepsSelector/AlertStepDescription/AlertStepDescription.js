import React, { useEffect } from 'react'
import { useFormikContext } from 'formik'
import AlertMessage from '../../../../../components/Alert/AlertMessage'
import WatchlistAndScreener from './steps/WatchlistAndScreener/WatchlistAndScreener'
import Notifications from './steps/Notifications/Notifications'
import Title from './steps/Title/Title'
import MetricsAndConditions from './steps/MetricsAndConditions/MetricsAndConditions'
import Assets from './steps/Assets/Assets'
import WalletAndConditions from './steps/WalletAndConditions/WalletAndConditions'
import styles from './AlertStepDescription.module.scss'

const DESCRIPTION_TYPES = {
  TITLE: 'title',
  NOTIFICATIONS: 'notifications_settings',
  METRICS_AND_CONDITIONS: 'metrics_and_conditions',
  ASSETS: 'assets',
  WATCHLISTS: 'watchlists',
  SCREENERS: 'screeners',
  WALLET: 'wallet'
}

function checkType (type) {
  switch (type) {
    case 'Check name and description':
    case 'Name & Description':
      return DESCRIPTION_TYPES.TITLE
    case 'Set up Notifications and Privacy':
    case 'Notification & Privacy settings':
      return DESCRIPTION_TYPES.NOTIFICATIONS
    case 'Choose Metric and Conditions':
    case 'Metric & Conditions':
      return DESCRIPTION_TYPES.METRICS_AND_CONDITIONS
    case 'Select Asset':
    case 'Asset':
      return DESCRIPTION_TYPES.ASSETS
    case 'Select Watchlist':
    case 'Watchlist':
      return DESCRIPTION_TYPES.WATCHLISTS
    case 'Select Screener':
    case 'Screener':
      return DESCRIPTION_TYPES.SCREENERS
    case 'Choose Wallet & Conditions':
    case 'Wallet & Conditions':
      return DESCRIPTION_TYPES.WALLET
    default:
      return {}
  }
}

const AlertStepDescription = ({
  description,
  type,
  status,
  selectedType,
  invalidStepsMemo,
  selected,
  isFinished
}) => {
  const {
    values: { settings }
  } = useFormikContext()
  const currentType = checkType(type)

  const isInvalid = invalidStepsMemo.has('trend')

  useEffect(() => {
    if (
      settings.target &&
      (settings.target.slug ||
        settings.target.word ||
        settings.target.watchlist_id) &&
      isInvalid
    ) {
      invalidStepsMemo.delete('trend')
    }
  }, [settings, isInvalid])

  switch (currentType) {
    case DESCRIPTION_TYPES.TITLE: {
      return (
        <Title
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    case DESCRIPTION_TYPES.NOTIFICATIONS: {
      return (
        <Notifications
          status={status}
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    case DESCRIPTION_TYPES.METRICS_AND_CONDITIONS: {
      return (
        <MetricsAndConditions
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    case DESCRIPTION_TYPES.ASSETS: {
      return (
        <Assets
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    case DESCRIPTION_TYPES.WATCHLISTS:
    case DESCRIPTION_TYPES.SCREENERS: {
      return (
        <WatchlistAndScreener
          selectedType={selectedType}
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    case DESCRIPTION_TYPES.WALLET: {
      return (
        <WalletAndConditions
          selectedType={selectedType}
          description={description}
          invalidStepsMemo={invalidStepsMemo}
          selected={selected}
          isFinished={isFinished}
        />
      )
    }
    default:
      return (
        <div className={styles.wrapper}>
          {(selected || isFinished) && (description || '')}
          {isInvalid && (
            <AlertMessage
              className={styles.error}
              error
              text='Social trend is required'
            />
          )}
        </div>
      )
  }
}

export default AlertStepDescription
