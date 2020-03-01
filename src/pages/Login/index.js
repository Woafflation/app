import React from 'react'
import cx from 'classnames'
import { parse } from 'query-string'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Panel from '@santiment-network/ui/Panel/Panel'
import LoginMetamaskBtn from './LoginMetamaskBtn'
import LoginEmail from './LoginEmail'
import LoginEmailBtn from './LoginEmailBtn'
import FreeTrialBlock from './FreeTrialBlock'
import styles from './index.module.scss'

const baseLocation = '/login'

const LoginOptions = () => (
  <div className={styles.container}>
    <div className={styles.loginBlock}>
      <h2 className={styles.title}>Welcome to Santiment</h2>
      <div className={styles.options}>
        <LoginMetamaskBtn />
        <div className={styles.divider}>
          <span className={styles.use}>or use</span>
        </div>
        <LoginEmailBtn />

        <div className={styles.new}>
          New to Santiment?{' '}
          <Link to={'/create-account'} className={styles.createLink}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
    <div>
      <FreeTrialBlock />
    </div>
  </div>
)

export default ({ isLoggedIn, token, location: { search = '' } }) => {
  if (isLoggedIn) {
    const { consent } = parse(search)
    let redirectTo = '/'

    if (consent) {
      redirectTo = `/consent?consent=${consent}&token=${token}`
    }

    return <Redirect to={redirectTo} />
  }

  return (
    <div className={cx('page', styles.wrapper)}>
      <Panel className={styles.panel}>
        <Switch>
          <Route exact path={`${baseLocation}/email`} render={LoginEmail} />
          <Route path={baseLocation} render={LoginOptions} />
        </Switch>
      </Panel>
    </div>
  )
}
