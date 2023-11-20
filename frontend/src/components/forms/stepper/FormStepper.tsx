import { Box, Stack, Step, StepButton, Stepper } from '@mui/material'
import Button from '@mui/material/Button'
import { ReactNode, useMemo, useState } from 'react'


interface FormStepperProps {
  children: ReactNode
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

export default function FormStepper({ children, activeStage, onChange, isStageReady }: FormStepperProps) {
  const [onSubmittingComponent, setOnSubmittingComponent] = useState<ReactNode>(null)
  const numberOfSteps = useMemo(() => {
    if (children && Array.isArray(children)) {
      return children.length
    }

    return 0
  }, [children])

  function handleNextClick() {
    onChange && onChange(Math.min(activeStage + 1, numberOfSteps))
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
              {children && Array.isArray(children) && children.map((child: React.ReactNode) => {
                console.log(child)

                return child
              })}
              {/*{forms.map((form, index) => (*/}
              {/*  <Step key={form.label}>*/}
              {/*    <StepButton color="inherit" onClick={() => handleSpecificStateClick(index)} sx={{*/}
              {/*      padding: 0,*/}
              {/*      paddingTop: '5px',*/}
              {/*      margin: 0,*/}
              {/*      marginTop: '-5px',*/}
              {/*      marginBottom: 0,*/}
              {/*    }}>*/}
              {/*      {form.label}*/}
              {/*    </StepButton>*/}
              {/*  </Step>*/}
              {/*))}*/}
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
