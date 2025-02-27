import React from 'react'
import SharedTriggerForm from '../../../Signals/signalFormManager/sharedForm/SharedTriggerForm'

const AlertPreview = ({
  setIsPreview,
  signal,
  prepareAlertTitle,
  handleCloseDialog
}) => {
  return (
    <SharedTriggerForm
      trigger={signal}
      originalTrigger={signal}
      settings={signal.settings}
      prepareAlertTitle={prepareAlertTitle}
      setIsPreview={setIsPreview}
      onClose={handleCloseDialog}
    />
  )
}

export default AlertPreview
