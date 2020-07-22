import React, { Fragment } from 'react'
import cx from 'classnames'
import Button from '@santiment-network/ui/Button'
import Panel from '@santiment-network/ui/Panel'
import Tooltip from '@santiment-network/ui/Tooltip'
import { Filter } from '../types'
import { ProLabel } from '../../../../../components/ProLabel'
import styles from './TypeDropdown.module.scss'

const METRIC_SEPARATOR = Filter.percent_up.key

const TypeDropdown = ({ isPro, type, onChange, showTimeRangesFilters }) => (
  <Tooltip
    on='click'
    trigger={
      <Button variant='flat' border className={styles.trigger}>
        <img src={Filter[type].icon} alt='operator' className={styles.img} />
      </Button>
    }
    position='bottom'
    align='end'
    className={styles.tooltip}
  >
    <Panel className={styles.panel}>
      {Object.values(Filter).map(({ icon, label, key, showTimeRange }) => {
        const isDisabled = Filter[type].isPro && !isPro
        let isShow = true

        if (!showTimeRangesFilters && showTimeRange) {
          isShow = false
        }

        return isShow ? (
          <Fragment key={key}>
            {key === METRIC_SEPARATOR && (
              <div className={styles.separator}>
                <span className={styles.label}>Percentage change</span>
                {!isPro && <ProLabel />}
              </div>
            )}
            <Button
              variant='ghost'
              fluid
              className={cx(
                styles.button,
                isDisabled && styles.button__disabled
              )}
              onClick={() => (isDisabled ? null : onChange(key))}
            >
              <img src={icon} alt='operator' className={styles.img} />
              <span className={styles.label}>{label}</span>
            </Button>
          </Fragment>
        ) : null
      })}
    </Panel>
  </Tooltip>
)

export default TypeDropdown
