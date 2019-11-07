import Raven from 'raven-js'
import { ofType } from 'redux-observable'
import { Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import gql from 'graphql-tag'
import { hasMetamask } from './../web3Helpers'
import * as actions from './../actions/types'

export const USER_GQL_FRAGMENT = gql`
  {
    firstLogin
    id
    email
    username
    sanBalance
    privacyPolicyAccepted
    marketingAccepted
    consent_id
    ethAccounts {
      address
      sanBalance
    }
    settings {
      hasTelegramConnected
      signalNotifyEmail
      signalNotifyTelegram
      newsletterSubscription
      isBetaMode
      theme
    }
    apikeys
    subscriptions {
      id
      plan {
        id
        name
        product {
          id
        }
      }
    }
  }
`
export const USER_EMAIL_LOGIN_QEURY = gql`
  query {
    currentUser 
      ${USER_GQL_FRAGMENT}
  }
`

const handleLaunch = (action$, store, { client }) =>
  action$.pipe(
    ofType(actions.APP_LAUNCHED),
    mergeMap(() => {
      const queryPromise = client.query({
        options: { fetchPolicy: 'network-only' },
        query: USER_EMAIL_LOGIN_QEURY
      })
      return Observable.from(queryPromise)
        .map(({ data }) => {
          if (data.currentUser) {
            return {
              type: actions.CHANGE_USER_DATA,
              user: data.currentUser,
              hasMetamask: hasMetamask()
            }
          }
          client.cache.reset()
          return {
            type: actions.APP_USER_HAS_INACTIVE_TOKEN
          }
        })
        .catch(error => {
          Raven.captureException(error)
          client.cache.reset()
          if (!/Network error/.test(error)) {
            return Observable.of({
              type: actions.APP_USER_HAS_INACTIVE_TOKEN,
              payload: {
                error
              }
            })
          }
          return Observable.of({
            type: '_'
          })
        })
        .takeUntil(action$.ofType(actions.USER_LOGIN_SUCCESS))
    })
  )

export default handleLaunch
