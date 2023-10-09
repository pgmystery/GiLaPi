import {
  AppBar,
  Box,
  Container,
  Paper,
  Step,
  StepButton,
  Stepper,
  Toolbar
} from '@mui/material'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import SetupGitlabsForm, { GitlabsListData } from '../components/forms/setup/SetupGitlabsForm.tsx'
import Button from '@mui/material/Button'
import SetupSuperAdminForm, { GilapiAdmin } from '../components/forms/setup/SetupSuperAdminForm.tsx'
import Typography from '@mui/material/Typography'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


interface SetupData {
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
  'Set GiLaPi-Admin'
]


export default function Setup() {
  const [setupState, setSetupState] = useState<number>(0)
  const [setupData, setSetupData] = useState<SetupData>({
    0: [],
    1: [],
  })
  const [isStageReady, setIsStageReady] = useState<boolean>(false)
  const navigate = useNavigate()

  function getSetupStageForm() {
    switch (setupState) {
      case 0:
        return <SetupGitlabsForm data={setupData['0']} setData={data => setSetupStageData<GitlabsListData[]>(data)} setIsStageReady={setIsStageReady} />
      case 1:
        return <SetupSuperAdminForm data={setupData['1']} gitlabs={setupData['0']} setData={data => setSetupStageData<GilapiAdmin>(data)} setIsStageReady={setIsStageReady} />
      default:
        return <Navigate to="/login" replace />
    }
  }

  function setSetupStageData<T>(stageData: T) {
    setSetupData({
      ...setupData,
      [setupState]: stageData
    })
  }

  function handleNextStageButtonClick() {
    setSetupState(Math.min(setupState + 1, setupStageLabels.length - 1))
  }

  function handleBackStageButtonClick() {
    setSetupState(Math.max(setupState - 1, 0))
  }

  function handleLogoClick() {
    navigate('/', {
      replace: true,
    })
  }

  return (
    <>
      <AppBar component="nav" sx={{
        backgroundColor: '#E24329',
      }}>
        <Toolbar disableGutters sx={{
          paddingLeft: '30px',
          paddingRight: '30px',
        }}>
          <Button
            variant="text"
            onClick={handleLogoClick}
            sx={{
              color: 'white',
              textTransform: 'none',
            }}
          >
            <Typography variant="h4">
              GiLaPi
            </Typography>
          </Button>
          <Typography sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} ></Typography>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{
        marginBottom: '16px',
      }} />
      <Container>
        <Paper sx={{
          padding: '20px',
        }}>
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
                    marginBottom: '10px',
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
        </Paper>
      </Container>
    </>
  )
}
