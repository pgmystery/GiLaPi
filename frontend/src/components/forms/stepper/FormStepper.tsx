import { Box, Stack, Step, StepButton, Stepper } from '@mui/material'
import Button from '@mui/material/Button'
import { ReactNode, useEffect, useState } from 'react'


interface FormStepperProps {
  children: ReactNode
  activeStage: number
  onNext?: (stage: number)=>void
  onBack?: (stage: number)=>void
  onChange?: (stage: number)=>void
}

export interface FormStepperFormType {
  label: string
  ready: boolean
  getComponent: (stage: number)=>ReactNode
}

export default function FormStepper({ children, activeStage, onNext, onBack, onChange }: FormStepperProps) {
  // const [index, setIndex] = useState<number>(0)

  useEffect(() => {
    if (onChange !== undefined) {
      onChange(index)
    }
  }, [index, onChange])

  function handleNextClick() {
    setIndex(Math.min(index + 1, forms.length))
    if (onNext) onNext(index)
  }

  function handleBackClick() {
    setIndex(Math.max(index - 1, 0))
    if (onBack) onBack(index)
  }

  function handleSpecificStateClick(stage: number) {
    setIndex(stage)
  }

  function getNextButton() {
    let nextButtonText = 'Next'

    if (index === forms.length - 1) {
      nextButtonText = 'Finish'
    }
    else if (index === forms.length) {
      nextButtonText = 'Retry'
    }

    return <Button variant="contained" disabled={!forms[index].ready} onClick={handleNextClick}>{ nextButtonText }</Button>
  }

  return (
    <Stack spacing={2 }>
      <Box>
        { children }
      </Box>
      <Box>
        <Stepper activeStep={index} alternativeLabel>
          {forms.map((form, index) => (
            <Step key={form.label}>
              <StepButton color="inherit" onClick={() => handleSpecificStateClick(index)} sx={{
                padding: 0,
                paddingTop: '5px',
                margin: 0,
                marginTop: '-5px',
                marginBottom: 0,
              }}>
                {form.label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box sx={{
        display: 'flex'
      }}>
        <Button variant="contained" disabled={index <= 0} onClick={handleBackClick}>Back</Button>
        <Box sx={{flexGrow: 1}}></Box>
        { getNextButton() }
      </Box>
    </Stack>
  )
}
