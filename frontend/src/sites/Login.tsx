import { Alert, AlertColor, AlertTitle, Backdrop, Box, CircularProgress, Collapse, Container } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../App.tsx'
import { Navigate, useLoaderData, useLocation } from 'react-router-dom'
import GitlabFetcher from '../libs/GitlabFetcher.ts'
import { LoaderLoginData } from './loaders/LoginLoader.tsx'
import GitlabLoginButton from '../components/button/GitlabLoginButton.tsx'
import { LoginState } from '../store/reducer.tsx'


export interface AlertDataType {
  severity?: AlertColor
  title: string
  message: string
}

interface LocationType {
  state: {alert?: AlertDataType} | null
}


export default function Login() {
  const { state: authState, dispatch } = useContext(AuthContext)
  const { gitlabs } = useLoaderData() as LoaderLoginData
  const [alertData, setAlertData] = useState<AlertDataType | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const { state } = useLocation() as LocationType
  const [loginButtonPressed, setLoginButtonPressed] = useState<boolean>(false)

  useEffect(() => {
    if (state?.alert) {
      const { alert } = state

      setAlertData(alert)
      setShowAlert(true)
    }
  }, [state])

  // if (gitlabs.length === 0) return <Navigate to={"/setup"} />

  const {clientId, redirectURI, isLoggedIn, gitlabURI} = authState

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  if (!clientId || !redirectURI) {
    return <Navigate to="/error" />
  }

  const gitlabFetcher = new GitlabFetcher(gitlabURI)
  // const gitlabOAuthURL = `http://192.168.1.2:8080/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&state=STATE&scope=${gitlabScope}&code_challenge=CODE_CHALLENGE&code_challenge_method=S256`
  const gitlabOAuthURL = gitlabFetcher.getAuthorizeURL(clientId, redirectURI, [
    'api',
    'read_user',
    'read_api',
    'read_repository',
    'profile',
    'sudo',
    'write_repository',
  ])

  function getAlert() {
    if (alertData !== null) {
      const {message, title, severity} = alertData

      return (
        <Alert severity={severity} onClose={() => setShowAlert(false)}>
          <AlertTitle>{ title }</AlertTitle>
          { message }
        </Alert>
      )
    }
  }

  function showLoading() {
    if (loginButtonPressed) {
      return (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )
    }
  }

  function handleLogin(loginSuccessed: boolean) {
    if (loginSuccessed) {
      dispatch({
        type: LoginState.RELOAD,
      })
    }
    else {
      setAlertData({
        severity: 'error',
        message: 'Login error',
        title: 'Login error'
      })
      setShowAlert(true)
      setLoginButtonPressed(false)
    }
  }

  return (
    <>
      <Collapse in={showAlert}>
        { getAlert() }
      </Collapse>
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
            paddingBottom: '20px',
          }}
        >
          <GitlabLoginButton
            gitlabOAuthURL={gitlabOAuthURL}
            // openPopup={{
            //   onLogin: handleLogin
            // }}
            onClick={() => setLoginButtonPressed(true)}
            disabled={loginButtonPressed}
          />
        </Box>
      </Container>
      { showLoading() }
    </>
  )
}
