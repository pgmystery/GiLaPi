import { Navigate, redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../App.tsx'
import { AuthUser, LoginState } from '../../store/reducer.tsx'
import { Backdrop, Box, CircularProgress, Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import GitlabFetcher from '../../libs/GitlabFetcher.ts'


// client_id=APP_ID&code=RETURNED_CODE&grant_type=authorization_code&redirect_uri=REDIRECT_URI&code_verifier=CODE_VERIFIER


export default function Redirect() {
  const { state, dispatch } = useContext(AuthContext)
  const {clientId, isLoggedIn, gitlabURI} = state
  const [searchParams] = useSearchParams()
  const codeData = searchParams.get('code')
  const navigate = useNavigate()

  useEffect(() => {
    const gitlabFetcher = new GitlabFetcher(gitlabURI)

    const requestToken = async () => {
      console.log(codeData)
      console.log(clientId)
      console.log(isLoggedIn)
      if (codeData && clientId && !isLoggedIn) {

        // const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/redirect`
        // const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=authorization_code&code_verifier=CODE_VERIFIER&redirect_uri=http://localhost:3000/oauth/redirect`
        // const gitlabURL = `http://192.168.1.2:8080/oauth/token/?client_id=${clientId}&code=${codeData}&grant_type=refresh_token&code_verifier=CODE_VERIFIER&redirect_uri=http://localhost:3000/oauth/redirect`

        try {
          const accessTokenData = await gitlabFetcher.requestAccessToken(
            clientId,
            codeData,
            'http://localhost:3000/oauth/redirect'  // TODO
          )

          if ('error' in accessTokenData) {
            if (window.opener) {
              // window.close()
              console.log('ERROR 1')
            }
            else {
              navigate('/login', {
                state: {
                  alert: {
                    severity: 'error',
                    title: accessTokenData.error,
                    message: accessTokenData.error_description,
                  },
                }
              })
            }

            return
          }

          const userData = await gitlabFetcher.getUserInfo()

          if ('error' in userData) {
            if (window.opener) {
              // window.close()
              console.log('ERROR 2')
            }
            else {
              navigate('/login', {
                state: {
                  alert: {
                    severity: 'error',
                    title: userData.error,
                    message: userData.error_description,
                  },
                }
              })
            }

            return
          }

          const { username, name, avatar_url } = userData

          const authUserData: AuthUser = {
            ...accessTokenData,
            username,
            name,
            avatar_url,
          }

          dispatch({
            type: LoginState.LOGIN,
            payload: {
              gitlabURI,
              user: authUserData,
              isLoggedIn: true
            }
          })
        }
        catch (e) {
          console.log('ERROR')
          console.log(gitlabFetcher.abortController.signal.aborted)
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
        if (window.opener) {
          console.log('ERROR 3')
          // window.close()
        }
        else {
          redirect('/login')
        }
      }
    }

    requestToken()

    return () => {
      gitlabFetcher.abortController.abort()
    }
  }, [clientId, codeData, dispatch, gitlabURI, isLoggedIn, navigate])

  if (isLoggedIn) {
    if (window.opener) {
      // window.close()
      console.log('IS_LOGGED_IN')
    }
    else {
      return <Navigate to="/login" replace={true} />
    }
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
            <Typography variant="h2" gutterBottom>Logging in (please wait)...</Typography>
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
    if (window.opener) {
      // window.close()
      console.log('DONE')
    }
    else {
      return <Navigate to="/login" replace={true} />
    }
  }
}
