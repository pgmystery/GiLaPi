import { Navigate, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../App.tsx'
import { AuthResponse, LoginState } from '../../store/reducer.tsx'
import { Backdrop, Box, CircularProgress, Container } from '@mui/material'
import Typography from '@mui/material/Typography'


// client_id=APP_ID&code=RETURNED_CODE&grant_type=authorization_code&redirect_uri=REDIRECT_URI&code_verifier=CODE_VERIFIER


export default function Redirect() {
  const { state, dispatch } = useContext(AuthContext)
  const {clientId, isLoggedIn} = state
  const [searchParams] = useSearchParams()
  const codeData = searchParams.get('code')
  const navigate = useNavigate()

  useEffect(() => {
    const abortController = new AbortController()

    const requestToken = async () => {
      if (codeData && clientId && !isLoggedIn) {
        const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/redirect`
        // const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=authorization_code&code_verifier=CODE_VERIFIER&redirect_uri=http://localhost:3000/oauth/redirect`
        // const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=refresh_token&code_verifier=CODE_VERIFIER&redirect_uri=http://localhost:3000/oauth/redirect`

        try {
          const response = await fetch(gitlabURL, {
            method: "POST",
            signal: abortController.signal,
          })
          const data = await response.json() as AuthResponse

          if ('error' in data) {
            navigate('/login', {
              state: {
                alert: {
                  severity: 'error',
                  title: data.error,
                  message: data.error_description,
                },
              }
            })
          }
          else {
            dispatch({
              type: LoginState.LOGIN,
              payload: {
                user: data,
                isLoggedIn: true
              }
            })
          }
        }
        catch (e) {
          console.log('ERROR')
          console.log(abortController.signal.aborted)
          console.log(e)

          const alert = {
            severity: 'error',
            title: 'Unknown Error',
            message: 'Unknown Error',
          }

          if (e instanceof DOMException) {
            alert.title = e.name
            alert.message = e.message
          }

          // navigate('/login', {
          //   state: {
          //     alert,
          //   }
          // })
        }
      }
      else {
        redirect('/login')
      }
    }

    requestToken()

    return () => {
      abortController.abort()
    }
  }, [clientId, codeData, dispatch, isLoggedIn, navigate])

  if (isLoggedIn) {
    return <Navigate to="/login" replace={true} />
  }

  if (codeData && clientId) {
    return (
      <>
        <Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <Typography variant="h3" gutterBottom>Logging in (please wait)...</Typography>
          </Box>
        </Container>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    )
  }
  else {
    return <Navigate to="/login" replace={true} />
  }
}
