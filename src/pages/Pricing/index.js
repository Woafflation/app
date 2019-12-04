import React from 'react'
import Button from '@santiment-network/ui/Button'
import Plans from './Plans'
import TokensTooltip from './TokensTooltip'
import Testimonials from '../../components/Testimonials'
import styles from './index.module.scss'

export default () => {
  return (
    <div className={styles.wrapper + ' page'}>
      <div className={styles.top}>
        <h1 className={styles.title}>
          Upgrade to Pro and get full possibilities
        </h1>
      </div>
      <TokensTooltip />
      <Plans id='plans' />

      <Testimonials />
      <section className={styles.ready}>
        <div className={styles.ready__content}>
          <h2 className={styles.ready__title}>Ready to upgrade?</h2>
          <h4 className={styles.ready__text}>
            Click below to access the SanAPI or join the Discord channel to
            share your solutions with the world
          </h4>
          <Button
            variant='fill'
            accent='positive'
            className={styles.ready__btn}
            as='a'
            href='#plans'
          >
            Choose plan
          </Button>
        </div>
      </section>
    </div>
  )
}
