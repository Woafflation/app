import React from 'react'
import cx from 'classnames'
import Button from '@santiment-network/ui/Button'
import Icon from '@santiment-network/ui/Icon'
import { connect } from 'react-redux'
import LoginMetamaskUndetected from './LoginMetamaskUndetected'
import { hasMetamask as detectMetamask } from '../../web3Helpers'
import { showNotification } from './../../actions/rootActions'
import GA from '../../utils/tracking'
import { USER_ETH_LOGIN } from './../../actions/types'
import styles from './index.module.scss'

const hasMetamask = detectMetamask()

const LoginMetamaskBtn = ({
  loginError,
  showErrorNotification,
  requestAuth
}) => {
  if (!hasMetamask) {
    return <LoginMetamaskUndetected />
  }

  if (loginError) {
    showErrorNotification()
  }

  return (
    <Button
      fluid
      className={cx(styles.btn, styles.btn_metamask)}
      onClick={requestAuth}
    >
      <Icon type='metamask-monochrome' className={styles.btn__icon} />
      Metamask
    </Button>
  )
}

const mapStateToProps = ({ user }) => ({
  loginError: user.error
})

const mapDispatchToProps = dispatch => ({
  requestAuth: consent => {
    GA.event({
      category: 'User',
      action: 'Choose an metamask provider'
    })
    dispatch({ type: USER_ETH_LOGIN, payload: { consent: '' } })
  },
  showErrorNotification: () => {
    dispatch(
      showNotification({
        variant: 'error',
        title: `Error occured during login process`,
        description: 'Please, try again later or use another login option',
        dismissAfter: 8000
      })
    )
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginMetamaskBtn)
