import { Box, Container, Paper } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import SetupGitlabsForm, { GitlabsListData } from '../components/forms/setup/SetupGitlabsForm.tsx'
import Button from '@mui/material/Button'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


interface SetupData {
  0: GitlabsListData[],
  1: unknown
}


export default function Setup() {
  const [setupState, setSetupState] = useState<number>(0)
  const [setupData, setSetupData] = useState<SetupData>({
    0: [],
    1: [],
  })
  const [isStageReady, setIsStageReady] = useState<boolean>(false)

  function getSetupStageForm() {
    switch (setupState) {
      case 0:
        return <SetupGitlabsForm data={setupData['0']} setData={data => setSetupStageData<GitlabsListData[]>(data)} setIsStageReady={setIsStageReady} />
      case 1:
        return <></>
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
    setSetupState(setupState + 1)
  }

  return (
    <Container>
      <Paper sx={{
        padding: '20px',
      }}>
        <Box>
          { getSetupStageForm() }
        </Box>
        <Box sx={{
          display: 'flex'
        }}>
          <Box sx={{flexGrow: 1}}></Box>
          <Button variant="contained" disabled={!isStageReady} onClick={handleNextStageButtonClick}>Next</Button>
        </Box>
      </Paper>
    </Container>
  )
}
