import React from 'react'
import { Icon } from '@santiment-network/ui'
import Timer from '../Timer'
import { dateDifferenceInWords } from '../../utils/dates'
import styles from './Refresh.module.scss'

const Refresh = ({ onRefreshClick, timestamp }) => {
  const options = { from: new Date(timestamp) }

  return (
    <div className={styles.refresh}>
      <Icon
        type='refresh'
        className={styles.refresh__icon}
        onClick={onRefreshClick}
      />
      <Timer interval={1000 * 60} syncRef={timestamp}>
        {() =>
          timestamp
            ? `Updated ${dateDifferenceInWords(options)}`
            : 'Data is not loaded'
        }
      </Timer>
    </div>
  )
}

export default Refresh
