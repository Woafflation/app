import React, { useState } from 'react'
import Panel from '@santiment-network/ui/Panel/Panel'
import Button from '@santiment-network/ui/Button'
import Cookie from './Cookie'
import GA from './../../utils/tracking'
import styles from './CookiePopup.module.scss'

const COOKIE_POLICY_ACCEPTED = 'COOKIE_POLICY_ACCEPTED'

const acceptCookiePolicy = () => {
  GA.event({
    category: 'User',
    action: 'Cookie policy accepted'
  })
  localStorage.setItem(COOKIE_POLICY_ACCEPTED, true)
}

const CookiePopup = () => {
  const [shown, setShown] = useState(
    !localStorage.getItem(COOKIE_POLICY_ACCEPTED)
  )

  function accept () {
    acceptCookiePolicy()
    setShown(false)
  }

  return (
    shown && (
      <Panel className={styles.wrapper} variant='modal'>
        <Cookie className={styles.image} />
        <div>
          <h2 className={styles.title}>We are using cookies</h2>
          <p className={styles.text}>
            This website uses the following types of cookies; strictly
            necessary, functional, performance and marketing cookies. By using
            this website, you accept our{' '}
            <a
              href='https://santiment.net/terms-conditions/'
              target='_blank'
              rel='noopener noreferrer'
              className={styles.link}
            >
              Terms&nbsp;&&nbsp;Conditions
            </a>
            .
          </p>
        </div>
        <Button
          variant='fill'
          accent='positive'
          className={styles.btn}
          onClick={accept}
        >
          Accept
        </Button>
      </Panel>
    )
  )
}

export default CookiePopup
