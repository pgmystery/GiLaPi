import {
  Box,
  Container,
  Paper,
  Step,
  StepButton,
  Stepper,
  Stack,
} from '@mui/material'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import SetupGitlabsForm, { GitlabsListData } from '../components/forms/setup/SetupGitlabsForm.tsx'
import Button from '@mui/material/Button'
import SetupSuperAdminForm, { GilapiAdmin } from '../components/forms/setup/SetupSuperAdminForm.tsx'
import GilapiToolbar from '../components/toolbar/GilapiToolbar.tsx'
import SetupFinish from '../components/forms/setup/SetupFinish.tsx'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


export interface SetupData {
  0: GitlabsListData[],
  1: GilapiAdmin
}

export interface SetupStageFormProps<T> {
  data: T
  setData: React.Dispatch<T>
  setIsStageReady: React.Dispatch<React.SetStateAction<boolean>>
}

const setupStageLabels = [
  'Add Gitlab environments',
  'Set GiLaPi-Admin',
]


export default function Setup() {
  const [setupState, setSetupState] = useState<number>(0)
  const [setupData, setSetupData] = useState<SetupData>({
    0: [],
    1: {},
  })
  const [isStageReady, setIsStageReady] = useState<boolean>(false)
  const navigate = useNavigate()

  function handleNextStageButtonClick() {
    setSetupState(Math.min(setupState + 1, setupStageLabels.length))
  }

  function handleBackStageButtonClick() {
    setSetupState(Math.max(setupState - 1, 0))
  }

  function handleLogoClick() {
    navigate('/', {
      replace: true,
    })
  }

  function handleFinishSetup(successfully: boolean) {
    if (successfully) {
      navigate('/login')
    }
    else {
      // TODO?!
    }
  }

  function getSetupStageForm() {
    switch (setupState) {
      case 0:
        return <SetupGitlabsForm data={setupData['0']} setData={data => {
          setSetupData({
            ...setupData,
            0: data
          })
        }} setIsStageReady={setIsStageReady} />
      case 1:
        return <SetupSuperAdminForm data={setupData['1']} gitlabs={setupData['0']} setData={data => setSetupData({
          ...setupData,
          1: data
        })} setIsStageReady={setIsStageReady} />
      case 2:
        return <SetupFinish data={setupData} sendDataReady={setupState === Object.keys(setupData).length} onFinish={handleFinishSetup} />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return (
    <>
      <GilapiToolbar onLogoClick={handleLogoClick} addToolbarSpace />
      <Container>
        <Paper sx={{
          padding: '20px',
        }}>
          <Stack spacing={2 }>
            <Box>
              { getSetupStageForm() }
            </Box>
            <Box>
              <Stepper activeStep={setupState} alternativeLabel>
                {setupStageLabels.map((label, index) => (
                  <Step key={label}>
                    <StepButton color="inherit" onClick={() => setSetupState(index)} sx={{
                      padding: 0,
                      paddingTop: '5px',
                      margin: 0,
                      marginTop: '-5px',
                      marginBottom: 0,
                    }}>
                      {label}
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box sx={{
              display: 'flex'
            }}>
              <Button variant="contained" disabled={setupState <= 0} onClick={handleBackStageButtonClick}>Back</Button>
              <Box sx={{flexGrow: 1}}></Box>
              <Button variant="contained" disabled={!isStageReady} onClick={handleNextStageButtonClick}>Next</Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </>
  )
}
