import React, { useEffect, useMemo, useState } from 'react'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import PageLoader from '../../components/Loader/PageLoader'
import AlertModalForm from './AlertModalForm'
import { ALERT_TYPES } from './constants'
import { createTrigger, updateTrigger } from '../Signals/common/actions'
import styles from './AlertModalFormMaster.module.scss'

const initialValues = {
  cooldown: '1d',
  description: '',
  iconUrl: '',
  isActive: true,
  isPublic: false,
  isRepeating: true,
  settings: {
    type: '',
    metric: '',
    target: { slug: '' },
    channel: [],
    time_window: '',
    operation: {}
  },
  tags: [],
  title: ''
}

const AlertModalFormMaster = ({
  defaultType,
  createAlert,
  updateAlert,
  setIsModalOpen,
  signal,
  isSignalLoading
}) => {
  const [selectedType, setSelectedType] = useState(defaultType)
  const [selectedStep, setSelectedStep] = useState(undefined)
  const [visitedSteps, setVisitedSteps] = useState([])
  const [finishedSteps, setFinishedSteps] = useState([])
  const visitedStepsMemo = useMemo(() => new Set(visitedSteps), [visitedSteps])
  const finishedStepsMemo = useMemo(() => new Set(finishedSteps), [
    finishedSteps
  ])

  useEffect(() => {
    if (defaultType.title !== selectedType.title) {
      setSelectedType(defaultType)
    }
  }, [defaultType])

  useEffect(() => {
    if (selectedStep === undefined) {
      setVisitedSteps([])
      setFinishedSteps([])
    }
  }, [selectedType])

  function handleSubmit (values, { setSubmitting }) {
    if (signal.id) {
      updateAlert(values)
    } else {
      createAlert(values)
    }
    setSubmitting(false)
    setIsModalOpen(false)
  }

  const selectorSettings = useMemo(
    () => ({
      selectedType,
      setSelectedType,
      selectedStep,
      setSelectedStep,
      visitedSteps: visitedStepsMemo,
      setVisitedSteps,
      finishedSteps: finishedStepsMemo,
      setFinishedSteps
    }),
    [
      selectedType,
      setSelectedType,
      selectedStep,
      setSelectedStep,
      visitedStepsMemo,
      setVisitedSteps,
      finishedStepsMemo,
      setFinishedSteps
    ]
  )

  const values = useMemo(() => {
    if (signal.id) {
      return { ...signal }
    }
    return { ...initialValues, settings: selectedType.settings, ...signal }
  }, [selectedType, signal])

  if (isSignalLoading) {
    return (
      <div>
        <PageLoader
          containerClass={styles.loaderWrapper}
          className={styles.loader}
        />
      </div>
    )
  }

  return (
    <Formik
      initialValues={values}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {formik => (
        <AlertModalForm selectorSettings={selectorSettings} {...formik} />
      )}
    </Formik>
  )
}

AlertModalFormMaster.defaultProps = {
  defaultType: ALERT_TYPES[0]
}

const mapDispatchToProps = dispatch => ({
  createAlert: payload => {
    dispatch(createTrigger(payload))
  },
  updateAlert: payload => {
    dispatch(updateTrigger(payload))
  }
})

export default connect(null, mapDispatchToProps)(AlertModalFormMaster)
