import React from 'react'
import cx from 'classnames'
import Input from '@santiment-network/ui/Input'
import { Filter } from '../types'
import styles from './ValueInput.module.scss'

const ValueInput = ({ onChange, defaultValue, type, metric }) => {
  const badge = Filter[type].badge || metric.badge || ''
  return (
    <div className={styles.wrapper}>
      <span className={styles.badge}>{badge}</span>
      <Input
        onChange={onChange}
        defaultValue={defaultValue}
        className={cx(styles.input, badge && styles.input__withBadge)}
      />
    </div>
  )
}

export default ValueInput
