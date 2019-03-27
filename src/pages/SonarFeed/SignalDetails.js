import React from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { push } from 'react-router-redux'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import {
  PanelWithHeader as Panel,
  Toggle,
  Button,
  Icon,
  Message
} from '@santiment-network/ui'
import StatusLabel from './../../components/StatusLabel'
import { TRIGGER_BY_ID_QUERY } from './../../ducks/Signals/SignalsGQL'
import { toggleTrigger, removeTrigger } from './../../ducks/Signals/actions'
import { mapTriggerToProps } from './../../ducks/Signals/utils'

const SignalDetails = ({
  trigger: { trigger, isLoading, isError, errorMessage = '' },
  toggleSignal,
  removeSignal,
  redirect,
  closeModal,
  id,
  match = {}
}) => {
  const signalId = id || (match.params || {}).id
  if (isLoading) {
    return <Panel header='Signals details'>Loading...</Panel>
  }
  if (isError) {
    return (
      <div>
        <Message variant='error'>{errorMessage}</Message>
        <hr />
        <p>You can try to delete this</p>
        <RemoveSignalButton
          id={signalId}
          removeSignal={removeSignal}
          redirect={closeModal || redirect}
        />
      </div>
    )
  }
  if (!isLoading && !trigger) {
    return <Redirect exact to={'/sonar/feed/my-signals'} />
  }
  const { isActive, cooldown, isPublic, title, description } = trigger
  return (
    <Panel header='Signals details'>
      {title}
      {description}
      <StatusLabel isPublic={isPublic} />
      <SettingsSignalButton id={signalId} />
      <RemoveSignalButton
        id={signalId}
        removeSignal={removeSignal}
        redirect={closeModal || redirect}
      />
      <Toggle
        onClick={() => toggleSignal({ id: signalId, isActive })}
        isActive={isActive}
      />
    </Panel>
  )
}

const RemoveSignalButton = ({ id, removeSignal, redirect }) => (
  <Button
    variant='ghost'
    onClick={() => {
      removeSignal(id)
      redirect()
    }}
  >
    <Icon type='remove' />
  </Button>
)

const SettingsSignalButton = ({ id }) => (
  <Button variant='ghost'>
    <Link to={`/sonar/feed/details/${id}/edit`}>
      <Icon type='settings' />
    </Link>
  </Button>
)

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
    props: mapTriggerToProps
  })
)

export default enhance(SignalDetails)
