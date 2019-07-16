import React from 'react'
import cx from 'classnames'
import Button from '@santiment-network/ui/Button'
import Tooltip from '@santiment-network/ui/Tooltip'
import Icon from '@santiment-network/ui/Icon'
import Panel from '@santiment-network/ui/Panel/Panel'
import { filteringTypes } from '../constants'
import Range from '../Range'
import Stat from '../Stat'
import styles from './WatchlistAnomalies.module.scss'

const WatchlistAnomalies = ({
  range: { value },
  changeRange,
  trends = [],
  onFilterAssets,
  type,
  isDesktop = false
}) => {
  const isTrendsFilter = type === filteringTypes.TRENDS
  const totalAnomalies = trends.length
  return trends.length > 0 ? (
    <div className={styles.wrapper}>
      <Icon type='flash' className={styles.icon} />
      <Range label='Anomalies' range={value} changeRange={changeRange} />
      <Button
        variant='flat'
        border
        className={cx(styles.button, isTrendsFilter && styles.active)}
        onClick={() => onFilterAssets(trends, filteringTypes.TRENDS)}
      >
        <Stat
          name='Trending assets:'
          values={[trends.length]}
          className={isTrendsFilter && styles.stat}
        />
      </Button>
      {isDesktop && (
        <Tooltip
          className={styles.tooltip}
          position='top'
          trigger={
            <div className={styles.description}>
              <Icon type='question-round-small' className={styles.question} />
              How it works
            </div>
          }
        >
          <Panel padding>
            Anomalies in metrics are detected using combination of statistical
            methods. Currently combination of this methodes defines boundary
            between normal and abnormal values.
          </Panel>
        </Tooltip>
      )}
    </div>
  ) : null
}

export default WatchlistAnomalies
