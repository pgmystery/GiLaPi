import { SetupStageFormProps } from '../../../sites/Setup.tsx'
import { GitlabsListData } from './SetupGitlabsForm.tsx'
import { Box, ListItem, ListItemButton, Stack, TextField } from '@mui/material'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import { useContext, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import GitlabLoginButton from '../../button/GitlabLoginButton.tsx'
import GitlabFetcher from '../../../libs/GitlabFetcher.ts'
import { AuthContext } from '../../../App.tsx'
import AlertCollapse from '../../alert/AlertCollapse.tsx'
import { LoginState } from '../../../store/reducer.tsx'


export type GilapiAdmin = {
  gitlab: GitlabsListData
  clientId: string
  username: string
}

interface SetupSuperAdminForm extends SetupStageFormProps<GilapiAdmin> {
  gitlabs: GitlabsListData[]
}

interface SelectedGitlab {
  index: number
  gitlab: GitlabsListData
}

interface LoginAlert {
  show: boolean
  severity: 'error' | 'success'
  title: string
  message: string
}


const gitlabFetcher = new GitlabFetcher('')


export default function SetupSuperAdminForm({ data, setData, setIsStageReady, gitlabs }: SetupSuperAdminForm) {
  const {state: authState, dispatch} = useContext(AuthContext)
  const { isLoggedIn, user } = authState
  const [selectedGitlab, setSelectedGitlab] = useState<SelectedGitlab | null>(null)
  const [gitlabClientId, setGitlabClientId] = useState<string>('')
  const [gitlabURL, setGitlabURL] = useState<string>('')
  const [loginAlert, setLoginAlert] = useState<LoginAlert>({
    show: false,
    severity: 'error',
    title: '',
    message: '',
  })

  useEffect(() => {
    if (selectedGitlab?.gitlab.url && gitlabClientId !== '') {
      const { redirectURI } = authState
      if (redirectURI) {
        gitlabFetcher.gitlabURI = selectedGitlab?.gitlab.url
        const gitlabURL = gitlabFetcher.getAuthorizeURL(gitlabClientId, redirectURI, [
          'api',
          'read_user',
          'read_api',
          'read_repository',
          'profile',
          'sudo',
          'write_repository',
        ])

        setGitlabURL(gitlabURL)
      }
    }
  }, [selectedGitlab, gitlabClientId, authState])

  useEffect(() => {
    setIsStageReady(false)

    if (selectedGitlab && isLoggedIn && user) {
      setData({
        clientId: gitlabClientId,
        gitlab: selectedGitlab.gitlab,
        username: user.username,
      })

      setLoginAlert({
        show: true,
        severity: 'success',
        title: 'Login success',
        message: 'Login was successfully',
      })

      setIsStageReady(true)
    }
  }, [isLoggedIn, user, selectedGitlab, gitlabClientId])

  useEffect(() => {
    console.log('DATA')
    console.log(data)
  }, [data])

  function handleLogin(loginSuccessed: boolean) {
    if (loginSuccessed) {
      dispatch({
        type: LoginState.RELOAD,
      })
    }
    else {
      setLoginAlert({
        show: true,
        severity: 'error',
        title: 'Login failed',
        message: 'Login to the gitlab failed'
      })
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Set a GiLaPi-Admin</Typography>
      <Stack spacing={2} sx={{
        marginBottom: '10px',
      }}>
        <Box>
          <List>
            { gitlabs.map((gitlab, index) => (
              <ListItemButton
                key={gitlab.name}
                selected={selectedGitlab?.index === index}
                onClick={() => setSelectedGitlab({
                  index,
                  gitlab,
                })}
              >
                <ListItem
                  // secondaryAction={
                  //   <IconButton>
                  //     <CheckCircleOutlineIcon color="success" />
                  //   </IconButton>
                  // }
                >
                  <ListItemText
                    primary={gitlab.name}
                    secondary={gitlab.url}
                  />
                </ListItem>
              </ListItemButton>
            )) }
          </List>
        </Box>
        <Box>
          <TextField label="Client-ID" variant="outlined" fullWidth value={gitlabClientId} onChange={event => setGitlabClientId(event.currentTarget.value)} />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <GitlabLoginButton
            gitlabOAuthURL={gitlabURL}
            openPopup={{
              onLogin: handleLogin,
              showLoading: true,
            }}
            // onClick={() => setLoginButtonPressed(true)}
            disabled={gitlabURL === '' || gitlabClientId === ''}
          />
        </Box>
        <AlertCollapse open={loginAlert.show} title={loginAlert.title} severity={loginAlert.severity} onClose={() => setLoginAlert({
            ...loginAlert,
            show: false,
          })
        }>
          { loginAlert.message }
        </AlertCollapse>
      </Stack>
    </>
  )
}
