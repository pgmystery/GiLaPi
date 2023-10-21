import { SetupStageFormProps } from '../../../sites/Setup.tsx'
import { GitlabsListData } from './SetupGitlabsForm.tsx'
import { Box, Button, ListItem, ListItemButton, Stack, TextField } from '@mui/material'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import { useContext, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import GitlabLoginButton from '../../button/GitlabLoginButton.tsx'
import GitlabFetcher from '../../../libs/GitlabFetcher.ts'
import { AuthContext } from '../../../App.tsx'
import AlertCollapse from '../../alert/AlertCollapse.tsx'
import { LoginState } from '../../../store/reducer.tsx'
import GitlabLogo from '../../../resources/GitlabLogo.tsx'


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
  severity: 'error' | 'success'
  title: string
  message: string
}


const gitlabFetcher = new GitlabFetcher('')


export default function SetupSuperAdminForm({ data, setData, setIsStageReady, gitlabs }: SetupSuperAdminForm) {
  const {state: authState, dispatch} = useContext(AuthContext)
  const { isLoggedIn, user } = authState
  const [selectedGitlab, setSelectedGitlab] = useState<SelectedGitlab | null>({
    index: 0,
    gitlab: gitlabs[0],
  })
  const [gitlabClientId, setGitlabClientId] = useState<string>('')
  const [gitlabURL, setGitlabURL] = useState<string>('')
  const [redirectURL, setRedirectURL] = useState<string>('')
  const [loginAlert, setLoginAlert] = useState<LoginAlert | null>(null)

  useEffect(() => {
    if (selectedGitlab && selectedGitlab.gitlab.url && gitlabClientId !== '') {
      gitlabFetcher.gitlabURI = selectedGitlab.gitlab.url
      const gitlabURL = gitlabFetcher.getAuthorizeURL(gitlabClientId, selectedGitlab.gitlab.gilapiUrl, [
        'api',
        'read_user',
        'read_api',
        'read_repository',
        'profile',
        'sudo',
        'write_repository',
      ])

      setGitlabURL(gitlabURL)
      setRedirectURL(selectedGitlab.gitlab.gilapiUrl)
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
        severity: 'success',
        title: 'Login success',
        message: 'Login was successfully',
      })

      setIsStageReady(true)
    }
  }, [isLoggedIn, user, selectedGitlab, gitlabClientId])

  function handleLogin(loginSuccessed: boolean) {
    if (loginSuccessed) {
      dispatch({
        type: LoginState.RELOAD,
      })
    }
    else {
      setLoginAlert({
        severity: 'error',
        title: 'Login failed',
        message: 'Login to the gitlab failed'
      })
    }
  }

  function getGitlabsListComponent() {
    return (
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
            <ListItem>
              <ListItemText
                primary={gitlab.name}
                secondary={gitlab.url}
              />
            </ListItem>
          </ListItemButton>
        )) }
      </List>
    )
  }

  function getFormComponent() {
    if (isLoggedIn) {
      return (
        <>
          <Box>
            <List>
              <ListItem selected>
                <ListItemText
                  primary={data.gitlab.name}
                  secondary={data.gitlab.url}
                />
              </ListItem>
            </List>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button
              variant="contained"
              startIcon={<GitlabLogo />}
              size="large"
              onClick={() => {
                setLoginAlert(null)
                dispatch({type: LoginState.LOGOUT})
              }}
            >
              Logout
            </Button>
          </Box>
        </>
      )
    }
    else {
      return (
        <>
          <Box>
            { getGitlabsListComponent() }
          </Box>
          <Box>
            <TextField
              label="Client-ID / Application-ID"
              variant="outlined"
              fullWidth
              autoFocus
              value={gitlabClientId}
              onChange={event => setGitlabClientId(event.currentTarget.value)}
            />
          </Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <GitlabLoginButton
              gitlabOAuthURL={gitlabURL}
              clientId={gitlabClientId}
              redirectURL={redirectURL}
              openPopup={{
                onLogin: handleLogin,
                showLoading: true,
              }}
              disabled={selectedGitlab?.index === null || gitlabClientId === ''}
            />
          </Box>
        </>
      )
    }
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>Set a GiLaPi-Admin</Typography>
      <Stack spacing={2} sx={{
        marginBottom: '10px',
      }}>
        { getFormComponent() }
      </Stack>
      <AlertCollapse open={loginAlert !== null} title={loginAlert?.title} severity={loginAlert?.severity}>
        { loginAlert?.message }
      </AlertCollapse>
    </>
  )
}
