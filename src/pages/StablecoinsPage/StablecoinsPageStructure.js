import React, { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import StablecoinsIntervals from '../../ducks/Stablecoins/StablecoinsIntervals/StablecoinsIntervals'
import CheckProPaywall from '../../ducks/Stablecoins/CheckProPaywall'
import styles from './StablecoinsPage.module.scss'

export const BlockHeader = ({
  title,
  description,
  setInterval,
  tag,
  className
}) => {
  if (!title) {
    return null
  }

  return (
    <div className={cx(styles.subHeader, className)}>
      <div className={styles.subTitle} id={tag}>
        {title}
        {setInterval && <StablecoinsIntervals onChange={setInterval} />}
      </div>
      {description && <div className={styles.subDescr}>{description}</div>}
    </div>
  )
}

export const Block = ({
  title,
  description,
  children,
  isPaywalActive = false,
  tag,
  className
}) => {
  const El = useMemo(
    () => {
      return isPaywalActive ? CheckProPaywall : Fragment
    },
    [isPaywalActive]
  )

  return (
    <div className={cx(styles.block, className)} id={tag}>
      <BlockHeader title={title} description={description} />

      <El>{children}</El>
    </div>
  )
}

export const BlockWithRanges = ({
  title,
  description,
  el: El,
  tag,
  checkPro = true
}) => {
  const [interval, setInterval] = useState('24h')

  const Wrapper = checkPro ? CheckProPaywall : Fragment

  return (
    <div className={styles.block} id={tag}>
      <BlockHeader
        title={title}
        description={description}
        setInterval={setInterval}
      />

      <Wrapper>
        <El interval={interval} />
      </Wrapper>
    </div>
  )
}
