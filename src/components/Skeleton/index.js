import React from 'react'
import cx from 'classnames'
import { CSSTransition } from 'react-transition-group'
import styles from './Skeleton.module.scss'

const transitionStyles = { exit: styles.animated, exitActive: styles.fadeOut }

const BaseSkeleton = ({ children, show }) => (
  <CSSTransition
    unmountOnExit
    in={show}
    timeout={1000}
    classNames={transitionStyles}
  >
    <div className={styles.wrapper}>{children}</div>
  </CSSTransition>
)

export const Skeleton = ({ className, show }) => (
  <BaseSkeleton show={show}>
    <div className={cx(styles.skeleton, className)} />
  </BaseSkeleton>
)

export const Skeletons = ({ className, show, repeat }) => {
  const elem = new Array(repeat).fill(0)

  return (
    <BaseSkeleton>
      {elem.map((_, idx) => (
        <div className={cx(styles.skeleton, className)} key={idx} />
      ))}
    </BaseSkeleton>
  )
}
