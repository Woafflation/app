import React from 'react'
import { Redirect } from 'react-router-dom'
import { push } from 'react-router-redux'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Message } from '@santiment-network/ui'
import StatusLabel from './../../components/StatusLabel'
import { TRIGGER_BY_ID_QUERY } from '../../ducks/Signals/common/queries'
import {
  toggleTrigger,
  removeTrigger
} from '../../ducks/Signals/common/actions'
import { mapGQLTriggerToProps } from '../../ducks/Signals/utils/utils'
import { SignalCardWrapper } from './../../components/SignalCard/SignalCardWrapper'
import { ToggleSignal } from './ToggleSignal'
import {
  RemoveSignalButton,
  SettingsSignalButton
} from '../../components/SignalCard/controls/SignalControls'
import styles from './SignalDetails.module.scss'

const SignalDetails = ({
  trigger: { trigger, isLoading, isError, errorMessage = '' },
  toggleSignal,
  removeSignal,
  redirect,
  closeModal,
  id,
  match = {},
  author,
  likesCount = 0
}) => {
  const signalId = id || (match.params || {}).id
  if (isLoading) {
    return <div className={styles.wrapperLoading}>Loading...</div>
  }

  const close = closeModal || redirect

  if (isError) {
    return (
      <div>
        <Message variant='error'>{errorMessage}</Message>
        <hr />
        <p>You can try to delete this</p>
        <RemoveSignalButton
          id={signalId}
          removeSignal={removeSignal}
          redirect={close}
        />
      </div>
    )
  }
  if (!isLoading && !trigger) {
    return <Redirect exact to={'/sonar/feed/my-signals'} />
  }

  const {
    isActive,
    isPublic,
    title,
    description,
    settings: { type }
  } = trigger

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SignalCardWrapper
          title={title}
          description={description}
          type={type}
          id={id}
          isModal={false}
        >
          <div className={styles.row}>
            {author && (
              <div className={styles.authorName}>
                by &nbsp;<span className={styles.teamLink}>{author}</span>
              </div>
            )}
            <StatusLabel isPublic={isPublic} />
          </div>

          <div className={styles.bottom}>
            <div className={styles.leftActions}>
              <SettingsSignalButton id={signalId} />
              <RemoveSignalButton
                id={signalId}
                removeSignal={removeSignal}
                redirect={close}
              />
            </div>
            <ToggleSignal
              isActive={isActive}
              toggleSignal={toggleSignal}
              id={signalId}
            />
          </div>
        </SignalCardWrapper>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  toggleSignal: ({ id, isActive }) => {
    dispatch(toggleTrigger({ id, isActive }))
  },
  removeSignal: id => {
    dispatch(removeTrigger(id))
  },
  redirect: (path = '/sonar/feed/my-signals') => {
    dispatch(push(path))
  }
})

const enhance = compose(
  connect(
    null,
    mapDispatchToProps
  ),
  graphql(TRIGGER_BY_ID_QUERY, {
    options: ({ id, match = {} }) => ({
      variables: {
        id: +(id || (match.params || {}).id)
      },
      fetchPolicy: 'network-only'
    }),
    props: mapGQLTriggerToProps
  })
)

export default enhance(SignalDetails)
