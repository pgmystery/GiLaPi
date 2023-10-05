import { Container, Paper } from '@mui/material'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import SetupGitlabsForm from '../components/forms/setup/SetupGitlabsForm.tsx'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


export default function Setup() {
  const [setupState, setSetupState] = useState<number>(0)

  function getSetupStageForm() {
    switch (setupState) {
      case 0:
        return <SetupGitlabsForm />
      case 1:
        return <></>
      default:
        return <Navigate to="/login" replace />
    }
  }

  return (
    <Container>
      <Paper>
        { getSetupStageForm() }
      </Paper>
    </Container>
  )
}
