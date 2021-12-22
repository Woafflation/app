import React from 'react'
import cx from 'classnames'
import Icon from '@santiment-network/ui/Icon'
import styles from './StepTitle.module.scss'

const StepTitle = ({
  iconType,
  icon,
  title,
  description,
  disabled,
  className,
  finished
}) => (
  <div className={cx(styles.wrapper, disabled && styles.disabled, finished && styles.finished, className)}>
    <div className={styles.iconWrapper}>
      {icon || <Icon type={iconType} className={styles.icon} />}
    </div>
    <div className={styles.titleWrapper}>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  </div>
)

export default StepTitle
