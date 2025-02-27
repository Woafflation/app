import React, { useEffect } from 'react'
import { Form } from 'formik'
import AlertModalSidebar from './components/AlertModalSidebar/AlertModalSidebar'
import AlertModalContent from './components/AlertModalContent/AlertModalContent'
import { useUpdateFinishedSteps } from './hooks/useUpdateFinishedSteps'
import { useUpdateNameAndDescription } from './hooks/useUpdateNameAndDescription'
import { ALERT_TYPES } from './constants'
import styles from './AlertModalForm.module.scss'

const AlertModalForm = ({
  selectorSettings,
  values,
  setValues,
  initialValues,
  hasSignal,
  signal,
  isEdited,
  isModalOpen,
  isSharedTrigger
}) => {
  const {
    setSelectedType,
    selectedType,
    visitedSteps,
    finishedSteps,
    setFinishedSteps,
    selectedStep,
    setFormPreviousValues,
    setInitialState
  } = selectorSettings

  useUpdateFinishedSteps({
    selectedType,
    visitedSteps,
    finishedSteps,
    setFinishedSteps,
    values,
    isModalOpen
  })
  useUpdateNameAndDescription({
    selectedType,
    selectedStep,
    values,
    hasSignal,
    isEdited
  })

  useEffect(() => {
    setFormPreviousValues(values)
  }, [values])

  useEffect(() => {
    if (signal) {
      const channel = signal.settings.channel
      const channelSetting = Array.isArray(channel) ? channel : [channel]

      setSelectedType(
        ALERT_TYPES.find((item, index) => {
          if (signal.settings.type === 'metric_signal') {
            if (signal.settings.target.slug) {
              return index === 0
            }
            if (signal.settings.target.watchlist_id) {
              return index === 1
            }
          }
          return item.settings.type === signal.settings.type
        })
      )

      if (signal.id) {
        setValues({
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
        setFormPreviousValues({
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
        setInitialState({
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
      } else {
        setValues({
          ...initialValues,
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
        setFormPreviousValues({
          ...initialValues,
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
        setInitialState({
          ...initialValues,
          ...signal,
          settings: { ...signal.settings, channel: channelSetting }
        })
      }
    }

    return () => {
      setValues(initialValues)
    }
  }, [signal])

  let isMetricsDisabled
  const hasTarget = values.settings.target

  if (selectedType) {
    switch (selectedType.title) {
      case 'Asset':
        const slug = hasTarget && values.settings.target.slug

        isMetricsDisabled =
          typeof slug === 'string' ? !slug : slug && slug.length === 0
        break
      case 'Watchlist':
        const watchlist = hasTarget && values.settings.target.watchlist_id

        isMetricsDisabled = !watchlist
        break
      case 'Screener':
        const screener =
          values.settings.operation.selector &&
          values.settings.operation.selector.watchlist_id

        isMetricsDisabled = !screener
        break
      default:
        isMetricsDisabled = false
    }

    return (
      <Form className={styles.wrapper}>
        <AlertModalSidebar
          isSharedTrigger={isSharedTrigger}
          isMetricsDisabled={isMetricsDisabled}
          selectorSettings={selectorSettings}
          values={values}
          hasSignal={hasSignal}
        />
        <AlertModalContent selectorSettings={selectorSettings} />
      </Form>
    )
  } else {
    return null
  }
}

export default AlertModalForm
