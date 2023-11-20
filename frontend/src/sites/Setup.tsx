import {
  Container,
  Paper,
} from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SetupGitlabsForm, { GitlabsListData } from '../components/forms/setup/SetupGitlabsForm.tsx'
import SetupSuperAdminForm, { GilapiAdmin } from '../components/forms/setup/SetupSuperAdminForm.tsx'
import GilapiToolbar from '../components/toolbar/GilapiToolbar.tsx'
import SetupFinish from '../components/forms/setup/SetupFinish.tsx'
import FormStepper from '../components/forms/stepper/FormStepper.tsx'
import FormStepperForm from '../components/forms/stepper/FormStepperForm.tsx'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


export interface SetupStageFormProps<T> {
  data: T
  onSubmit: React.Dispatch<T>
  onReadyChanged: React.Dispatch<React.SetStateAction<boolean>>
}


export interface SetupSubmitData {
  gitlabs: GitlabsListData[]
  admin: GilapiAdmin
}

// type SetupFormDatas = [SetupFormData<GitlabsListData[]>, SetupFormData<GilapiAdmin>]

export default function Setup() {
  const [currentFormStage, setCurrentFormStage] = useState<number>(0)
  const [isCurrentStageReady, setIsCurrentStageReady] = useState<boolean>(false)
  const [formGitlabsData, setFormGitlabsData] = useState<GitlabsListData[]>([])
  const [formSuperAdminData, setFormSuperAdminData] = useState<GilapiAdmin>({})
  const navigate = useNavigate()

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

  function handleFormFinish() {
    const data: SetupSubmitData = {
      gitlabs: formGitlabsData,
      admin: formSuperAdminData,
    }

    return <SetupFinish data={data} onFinish={handleFinishSetup} />
  }

  function onFormStepperChange(stage: number) {
    setCurrentFormStage(stage)
  }

  return (
    <>
      <GilapiToolbar onLogoClick={handleLogoClick} addToolbarSpace />
      <Container>
        <Paper sx={{
          padding: '20px',
        }}>
          <FormStepper activeStage={currentFormStage} isStageReady={isCurrentStageReady} onChange={onFormStepperChange} onSubmit={handleFormFinish}>
            <FormStepperForm label="Add Gitlab environments" activeStage={currentFormStage} index={0}>
              <SetupGitlabsForm data={formGitlabsData} onSubmit={setFormGitlabsData} onReadyChanged={setIsCurrentStageReady} />
            </FormStepperForm>
            <FormStepperForm label="Set GiLaPi-Admin" activeStage={currentFormStage} index={1}>
              <SetupSuperAdminForm gitlabs={formGitlabsData} data={formSuperAdminData} onSubmit={setFormSuperAdminData} onReadyChanged={setIsCurrentStageReady} />
            </FormStepperForm>
          </FormStepper>
        </Paper>
      </Container>
    </>
  )
}
