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
import FormStepper, { FormStepperFormType } from '../components/forms/stepper/FormStepper.tsx'
import FormStepperForm from '../components/forms/stepper/FormStepperForm.tsx'


// STEPS:
//  1. Add gitlab(s) urls
//  2. Setup the super_admin over a login in a gitlab instance
//


export interface SetupStageFormProps<T> {
  data: T
  setData: React.Dispatch<T>
  setIsStageReady: React.Dispatch<React.SetStateAction<boolean>>
}

interface SetupFormData<T extends Array<unknown>> extends FormStepperFormType{
  data: T[number]
  setData: React.Dispatch<T[number]>
}

// interface SetupFormDatas {
//   0: GitlabsListData[]
//   1: GilapiAdmin
// }

type SetupFormDatas = [GitlabsListData[], GilapiAdmin]

// type SetupFormDatas = [SetupFormData<GitlabsListData[]>, SetupFormData<GilapiAdmin>]

export default function Setup() {
  const [currentFormStage, setCurrentFormStage] = useState<number>(0)
  const [forms, setForms] = useState<SetupFormData<SetupFormDatas>[]>([
    {
      label: 'Add Gitlab environments',
      ready: false,
      data: [],
      setData: ()=>{},
      getComponent: getSetupStageForm,
    },
    {
      label: 'Set GiLaPi-Admin',
      ready: false,
      data: {},
      setData: ()=>{},
      getComponent: getSetupStageForm,
    }
  ])

  const [setupState, setSetupState] = useState<number>(0)
  const [formStepperData, setFormStepperData] = useState<FormStepperFormType[]>()
  // const [setupData, setSetupData] = useState<SetupData>({
  //   0: [],
  //   1: {},
  // })
  // const [isStageReady, setIsStageReady] = useState<boolean>(false)
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

  function setFormData<T>(stage: number, data: T) {
    forms[stage].data = data
    setForms(forms)
  }

  function getSetupStageForm(stage: number) {
    switch (stage) {
      case 0:
        return <SetupGitlabsForm data={forms[0].data} setData={data => {
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
          <FormStepper activeStage={currentFormStage} onChange={onFormStepperChange}>
            {/*{ getSetupStageForm() }*/}
            <FormStepperForm>
              <SetupGitlabsForm data={forms[0].data} onDataSubmit={} />
            </FormStepperForm>
            <FormStepperForm>
              <SetupGitlabsForm data={forms[0].data} onDataSubmit={} />
            </FormStepperForm>
          </FormStepper>
        </Paper>
      </Container>
    </>
  )
}
