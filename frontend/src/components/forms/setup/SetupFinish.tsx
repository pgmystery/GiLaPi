import { useEffect, useState } from 'react'
import { Backdrop, Box, CircularProgress } from '@mui/material'
import Typography from '@mui/material/Typography'
import AlertCollapse from '../../alert/AlertCollapse.tsx'
import GilapiClient, { SetupFinishData, SetupFinishGitlabsData } from '../../../libs/GilapiClient.ts'
import { SetupSubmitData } from '../../../sites/Setup.tsx'


interface SetupFinishProps {
  data: SetupSubmitData
  onFinish: (successfully: boolean)=>void
}

interface Error {
  title: string
  message: string
}

export default function SetupFinish({ data, onFinish }: SetupFinishProps) {
  const [isSendingData, setIsSendingData] = useState<boolean>(true)
  const [finishSetupError, setFinishSetupError] = useState<Error | null>(null)

  useEffect(() => {
    const { gitlabs: gitlabsData, admin: gilapiAdmin } = data

    const setupDataFinal: SetupFinishData = {
      gitlabs: gitlabsData.map<SetupFinishGitlabsData>(gitlab => {
        const { name, url, gilapiUrl } = gitlab

        const data: SetupFinishGitlabsData = {
          name,
          url,
          redirect_url: gilapiUrl,
        }

        if (name === gilapiAdmin.gitlab.name && url === gilapiAdmin.gitlab.url) {
          data.admin = {
            name: gilapiAdmin.username,
            client_id: gilapiAdmin.clientId,
          }
        }

        return data
      })
    }

    const gilapiClient = new GilapiClient()
    gilapiClient.sendSetup(setupDataFinal)
                .then(() => onFinish(true))
                .catch(e => {
                  console.log('ERROR')
                  console.log(e)

                  if (e instanceof DOMException) {
                    setFinishSetupError({
                      title: e.name,
                      message: e.message,
                    })
                  }
                  else if (e instanceof Error) {
                    setFinishSetupError({
                      title: "Error",
                      message: e.message,
                    })
                  }
                  else {
                    setFinishSetupError({
                      title: "Error",
                      message: "Unknown Error",
                    })
                  }
                  setIsSendingData(false)
                  onFinish(false)
                })

    return () => gilapiClient.abortController.abort()
  }, [data, onFinish])

  return (
    <>
      <Box>
        <Typography variant="h4" align="center" gutterBottom>Finishing Setup...</Typography>
      </Box>
      <Box>
        <AlertCollapse open={finishSetupError !== null} title={finishSetupError?.title} severity="error">
          { finishSetupError?.message }
        </AlertCollapse>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSendingData}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
