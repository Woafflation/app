import React from 'react'
import { useFormikContext } from 'formik'
import Button from '@santiment-network/ui/Button'
import AlertStepsSelector from '../AlertStepsSelector/AlertStepsSelector'
import StepsContent from './StepsContent/StepsContent'
import styles from './AlertModalContent.module.scss'

const AlertModalContent = ({ isMetricsDisabled, selectorSettings }) => {
  const { submitForm, isSubmitting } = useFormikContext()

  const { selectedStep, selectedType, finishedSteps, id } = selectorSettings

  if (selectedStep !== undefined) {
    return (
      <div className={styles.wrapper}>
        <StepsContent selectorSettings={selectorSettings} />
      </div>
    )
  }

  function handleSubmit () {
    if (isSubmitting) {
      submitForm()
    }
  }

  return (
    <div className={styles.wrapper}>
      <AlertStepsSelector
        items={selectedType.steps}
        selectorSettings={selectorSettings}
        isMetricsDisabled={isMetricsDisabled}
      />
      <Button
        type='submit'
        disabled={selectedType.steps.length !== finishedSteps.size}
        variant='fill'
        border={false}
        accent='positive'
        className={styles.submit}
        onClick={handleSubmit}
      >
        {id ? 'Update' : 'Create'} alert
      </Button>
    </div>
  )
}

export default AlertModalContent
