import { redirect, useNavigate, useSearchParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../App.tsx'
import { LoginState } from '../../store/reducer.tsx'
import { Backdrop, Box, CircularProgress, Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import SimpleWindowMessageClient from '../../libs/simpleWindowMessageClient.ts'
import AccessTokenFetcher from '../../libs/fetcher/accessTokenFetcher.ts'


// client_id=APP_ID&code=RETURNED_CODE&grant_type=authorization_code&redirect_uri=REDIRECT_URI&code_verifier=CODE_VERIFIER

interface RequiredData {
  clientId: string | undefined
  gitlabURL: string | undefined
  redirectURL: string | undefined
}

interface PopupWindowPostMessageDataResponse {
  clientId: string
  gitlabURL: string
  redirectURL: string
}

function exit(location: string = '/login') {
  if (window.opener) {
    window.close()
  }
  else {
    redirect(location)
  }
}

export default function Redirect() {
  const { state, dispatch } = useContext(AuthContext)
  const { clientId: initClientId, isLoggedIn, gitlabURI: initGitlabURL, redirectURI: initRedirectURL } = state
  const [requiredDataForRequest, setRequiredDataForRequest] = useState<RequiredData>({
    clientId: initClientId,
    gitlabURL: initGitlabURL,
    redirectURL: initRedirectURL,
  })
  const [searchParams] = useSearchParams()
  const codeData = searchParams.get('code')
  const navigate = useNavigate()

  useEffect(() => {
    if (codeData && !isLoggedIn) {
      const { clientId, gitlabURL, redirectURL } = requiredDataForRequest
      if (clientId && gitlabURL && redirectURL) {
        const gitlabOriginURL = new URL(gitlabURL).origin
        const accessTokenFetcher = new AccessTokenFetcher(gitlabOriginURL)

        accessTokenFetcher.fetch({
          clientId,
          codeData,
          redirectURL,
        })
          .then(authUserData => {
            dispatch({
              type: LoginState.LOGIN,
              payload: {
                gitlabURI: gitlabOriginURL,
                user: authUserData,
                isLoggedIn: true
              }
            })
          })
          .catch(e => {
            const alert = {
              severity: 'error',
              title: 'Unknown Error',
              message: 'Unknown Error',
            }

            if (e instanceof DOMException) {
              alert.title = e.name
              alert.message = e.message
            }
          })
        .finally(() => exit())

        return () => accessTokenFetcher.fetcher.abortController.abort()
      }
      else {
        if (window.opener) {
          const simpleWindowMessageClient = new SimpleWindowMessageClient(window.opener, window)

          simpleWindowMessageClient.echo<PopupWindowPostMessageDataResponse>('accessToken', ['clientId', 'gitlabURL', 'redirectURL'], 10000)
            .then(({ message, event }) => {
              if (event.origin !== window.location.origin) return

              const { clientId, gitlabURL, redirectURL } = message

              setRequiredDataForRequest({
                clientId,
                gitlabURL,
                redirectURL,
              })
            })
            .catch(() => exit())
        }
        else {
          navigate('/login', {
            state: {
              alert: {
                severity: 'error',
                title: 'Missing client-id',
                message: 'Login-Error: Never received the client-id from gitlab',
              },
            }
          })
        }
      }
    }
  }, [codeData, dispatch, requiredDataForRequest, navigate, isLoggedIn])

  if (isLoggedIn || !codeData) exit()

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
          <Typography variant="h2" align="center" gutterBottom>Logging in (please wait)...</Typography>
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
