import React, { useState } from 'react'
import cx from 'classnames'
import { useHistory, useRouteMatch } from 'react-router-dom'
import Dialog from '@santiment-network/ui/Dialog'
import LoginPopup from '../../components/banners/feature/PopupBanner'
import AlertTriggerButton from './components/AlertTriggerButton/AlertTriggerButton'
import ConfirmClose from './components/ConfirmClose/ConfirmClose'
import AlertModalFormMaster from './AlertModalFormMaster'
import { useUser } from '../../stores/user'
import styles from './AlertModal.module.scss'

const AlertModal = ({
  id,
  disabled,
  triggerButtonProps,
  modalTitle,
  defaultOpen,
  trigger,
  defaultType,
  signalData,
  isUserTheAuthor = true,
  prepareAlertTitle
}) => {
  const match = useRouteMatch('/alerts/:id')
  const history = useHistory()
  const { isLoggedIn } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(defaultOpen)
  const [isClosing, setIsClosing] = useState(false)
  const [isEdited, setIsEdited] = useState(false)
  const [isPreview, setIsPreview] = useState(!isUserTheAuthor)

  if (!isLoggedIn) {
    return (
      <LoginPopup>
        {trigger || (
          <AlertTriggerButton
            disabled={disabled}
            triggerButtonProps={triggerButtonProps}
          />
        )}
      </LoginPopup>
    )
  }

  function handleCloseDialog () {
    if (match && match.params.id) {
      history.push('/alerts')
    }
    setIsModalOpen(false)
    setIsClosing(false)
    setIsPreview(!isUserTheAuthor)
  }

  return (
    <>
      <Dialog
        withAnimation
        title={isPreview ? 'Alert details' : modalTitle}
        open={isModalOpen}
        onOpen={() => setIsModalOpen(true)}
        onClose={() => {
          if (isEdited) {
            setIsClosing(true)
          } else {
            handleCloseDialog()
          }
        }}
        trigger={
          trigger || (
            <AlertTriggerButton
              disabled={disabled}
              triggerButtonProps={triggerButtonProps}
            />
          )
        }
        classes={{
          dialog: cx(
            styles.dialog,
            isClosing && styles.hidden,
            isPreview && styles.preview
          )
        }}
      >
        <AlertModalFormMaster
          isPreview={isPreview}
          setIsPreview={setIsPreview}
          id={id}
          signalData={signalData}
          defaultType={defaultType}
          handleCloseDialog={handleCloseDialog}
          setIsEdited={setIsEdited}
          isEdited={isEdited}
          isModalOpen={isModalOpen}
          isUserTheAuthor={isUserTheAuthor}
          prepareAlertTitle={prepareAlertTitle}
        />
      </Dialog>
      <ConfirmClose
        isOpen={isClosing}
        onApprove={handleCloseDialog}
        onCancel={() => {
          setIsClosing(false)
          setIsModalOpen(true)
        }}
      />
    </>
  )
}

AlertModal.defaultProps = {
  modalTitle: 'Create custom alerts',
  disabled: false,
  defaultOpen: false
}

export default AlertModal
