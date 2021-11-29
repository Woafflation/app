import React, { useCallback, useEffect } from 'react'
import Steps from '../../../../components/Steps/Steps'

function AlertStepsSelector ({
  size,
  selectedType,
  selectedStep,
  setSelectedStep,
  isMetricsDisabled,
  items,
  visitedSteps,
  setVisitedSteps
}) {
  useEffect(() => {
    if (selectedStep === undefined) {
      setVisitedSteps([])
    }
  }, [selectedType])

  const handleStepClick = stepIndex => {
    setSelectedStep(stepIndex)

    if (!visitedSteps.includes(stepIndex)) {
      setVisitedSteps(prev => [...prev, stepIndex])
    }
  }

  const renderSteps = useCallback(() => {
    return items.map((step, index) => {
      const disabled = items.length !== 3 && isMetricsDisabled && index === 1

      let status = (visitedSteps.includes(index) && 'finish') || 'process'

      if (items.length !== 3 && isMetricsDisabled && index === 0) {
        status = 'process'
      }

      return (
        <Steps.Step
          status={status}
          disabled={disabled}
          key={step.label}
          title={step.label}
          description={step.description}
          onStepClick={() => handleStepClick(index)}
        />
      )
    })
  }, [visitedSteps, items, isMetricsDisabled])

  return (
    <Steps initial={0} current={selectedStep} size={size}>
      {renderSteps()}
    </Steps>
  )
}

export default AlertStepsSelector
