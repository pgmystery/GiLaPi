import { Box, Stack, Step, StepButton, Stepper } from '@mui/material'
import Button from '@mui/material/Button'
import { ReactElement, ReactNode, useMemo, useState } from 'react'
import FormStepperForm, { FormStepperFormProps } from './FormStepperForm.tsx'

type FormStepperFormElement = ReactElement<FormStepperFormProps, typeof FormStepperForm>

interface FormStepperProps {
  children: FormStepperFormElement | FormStepperFormElement[]
  activeStage: number
  isStageReady: boolean
  onSubmit?: ()=>ReactNode
  onChange?: (stage: number)=>void
}

export interface FormStepperFormType {
  label: string
  ready: boolean
  getComponent: (stage: number)=>ReactNode
}

export default function FormStepper({ children, activeStage, onChange, isStageReady, onSubmit }: FormStepperProps) {
  const [onSubmittingComponent, setOnSubmittingComponent] = useState<ReactNode>(null)
  const numberOfSteps = useMemo(() => {
    if (children && Array.isArray(children)) {
      return children.length
    }

    return 0
  }, [children])

  function handleNextClick() {
    if (activeStage < numberOfSteps - 1) {
      onChange && onChange(Math.min(activeStage + 1, numberOfSteps))
    }
    else {
      if (onSubmit) {
        const onSubmittingComponent = onSubmit()

        setOnSubmittingComponent(onSubmittingComponent)
      }
    }
  }

  function handleBackClick() {
    onChange && onChange(Math.max(activeStage - 1, 0))
  }

  function handleSpecificStageClick(stage: number) {
    onChange && onChange(stage)
  }

  function getNextButton() {
    let nextButtonText = 'Next'

    if (activeStage === numberOfSteps - 1) {
      nextButtonText = 'Finish'
    }
    else if (activeStage === numberOfSteps) {
      nextButtonText = 'Retry'
    }

    return <Button variant="contained" disabled={!isStageReady} onClick={handleNextClick}>{ nextButtonText }</Button>
  }

  return (
    onSubmittingComponent
      ? onSubmittingComponent
      : <Stack spacing={2}>
          <Box>
            { children }
          </Box>
          <Box>
            <Stepper activeStep={activeStage} alternativeLabel>
              {children && Array.isArray(children) && children.map(child => {
                if (!child || child.type !== FormStepperForm) {
                  return
                }

                const { label, index } = child.props

                return (
                  <Step key={index}>
                    <StepButton color="inherit" onClick={() => handleSpecificStageClick(index)} sx={{
                      padding: 0,
                      paddingTop: '5px',
                      margin: 0,
                      marginTop: '-5px',
                      marginBottom: 0,
                    }}>
                      {label}
                    </StepButton>
                  </Step>
                )
              })}
            </Stepper>
          </Box>
          <Box sx={{
            display: 'flex'
          }}>
            <Button variant="contained" disabled={activeStage <= 0} onClick={handleBackClick}>Back</Button>
            <Box sx={{flexGrow: 1}}></Box>
            { getNextButton() }
          </Box>
        </Stack>
  )
}
