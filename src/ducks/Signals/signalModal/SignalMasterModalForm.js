import React, { useState, useEffect } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { checkIsLoggedIn } from '../../../pages/UserSelectors'
import GetSignal from '../common/getSignal'
import { SIGNAL_ROUTES } from '../common/constants'
import ConfirmSignalModalClose from './confirmClose/ConfirmSignalModalClose'
import SignalDialog from './SignalDialog'

const SignalMasterModalForm = ({
  label = 'New signal',
  metaFormSettings,
  canRedirect = true,
  enabled = true,
  triggerId,
  isLoggedIn,
  match,
  trigger: dialogTrigger,
  buttonParams = {},
  dialogProps,
  shareParams = {},
  userId,
  redirect,
  previousPage = SIGNAL_ROUTES.MY_SIGNALS,
  defaultOpen = true
}) => {
  const { id: shareId, isShared: isOldShared } = shareParams

  if (!triggerId && match) {
    triggerId = match.params.id
  } else if (isOldShared && shareId) {
    triggerId = shareId
  }

  const hasTrigger = +triggerId > 0

  const [dialogOpenState, setDialogOpenState] = useState(
    defaultOpen ? hasTrigger : false
  )
  const [isApproving, setIsAppoving] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  useEffect(
    data => {
      defaultOpen && setDialogOpenState(hasTrigger)
    },
    [triggerId]
  )

  const onCancelClose = () => {
    setIsAppoving(false)
  }

  const goBack = () => {
    if (hasTrigger) {
      canRedirect && redirect && redirect(previousPage)
    }
  }

  const onApprove = () => {
    setIsAppoving(false)
    setDialogOpenState(false)

    goBack()
  }

  const onCloseMainModal = () => {
    if (isChanged && isLoggedIn) {
      setIsAppoving(true)
    } else {
      setDialogOpenState(false)
      goBack()
    }
  }

  const formChangedCallback = isChanged => {
    setIsChanged(isChanged)
  }

  return (
    <GetSignal
      triggerId={triggerId}
      render={({ trigger = {}, userId: triggerUserId }) => {
        const { isLoading, isError } = trigger

        let isShared =
          isOldShared || (!!triggerUserId && +userId !== triggerUserId)

        if (isShared && trigger && trigger.trigger) {
          trigger.trigger = { ...trigger.trigger, ...shareParams }
        }

        return (
          <>
            {isApproving && (
              <ConfirmSignalModalClose
                isOpen={isApproving}
                onCancel={onCancelClose}
                onApprove={onApprove}
              />
            )}
            <SignalDialog
              dialogOpenState={dialogOpenState}
              setDialogOpenState={setDialogOpenState}
              onCloseMainModal={onCloseMainModal}
              dialogTrigger={dialogTrigger}
              enabled={enabled}
              label={label}
              isError={isError}
              isShared={isShared}
              isLoggedIn={isLoggedIn}
              dialogProps={dialogProps}
              isLoading={isLoading}
              trigger={trigger}
              formChangedCallback={formChangedCallback}
              canRedirect={canRedirect}
              metaFormSettings={metaFormSettings}
              buttonParams={buttonParams}
            />
          </>
        )
      }}
    />
  )
}

const mapStateToProps = state => {
  return {
    isLoggedIn: checkIsLoggedIn(state),
    userId: +state.user.data.id
  }
}

const mapDispatchToProps = dispatch => ({
  redirect: url => {
    dispatch(push(url || SIGNAL_ROUTES.MY_SIGNALS))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignalMasterModalForm)
