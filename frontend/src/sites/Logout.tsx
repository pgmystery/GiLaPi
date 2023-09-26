import { useContext, useEffect } from 'react'
import { AuthContext } from '../App.tsx'
import { LoginState } from '../store/reducer.tsx'
import { Navigate, useNavigate } from 'react-router-dom'
import { Backdrop, Box, CircularProgress, Container } from '@mui/material'
import Typography from '@mui/material/Typography'
import { AlertDataType } from './Login.tsx'


export default function Logout() {
  const { state, dispatch } = useContext(AuthContext)
  const { isLoggedIn, clientId, user } = state
  const navigate = useNavigate()

  useEffect(() => {
    function sendLogout(logoutAlert: AlertDataType) {
      dispatch({
        type: LoginState.LOGOUT,
      })

      navigate('/login', {
        replace: true,
        state: {
          alert: logoutAlert
        },
      })
    }

    if (isLoggedIn) {
      const abortController = new AbortController()

      const logout = async () => {
        const logoutAlert: AlertDataType = {
          severity: 'success',
          title: 'Logout',
          message: 'Successfully logged out'
        }

        if (user) {
          const { access_token: accessToken } = user

          try {
            const parameters = `client_id=${clientId}&token=${accessToken}`
            const response = await fetch(`http://192.168.1.2:8080/oauth/revoke/?${parameters}`, {
              method: 'POST',
              signal: abortController.signal
            })

            if (response.status !== 200) {
              logoutAlert.severity = "error"
              logoutAlert.message = 'Unknown Error'
            }
            else {
              console.log('LOGOUT SUCCESS!')
              sendLogout(logoutAlert)  // TODO: REMOVE THIS IN PRODUCTION BECAUSE NO STRICT MODE
            }
          }
          catch (e) {
            if (e instanceof DOMException) {
              logoutAlert.severity = "error"
              logoutAlert.title = `${logoutAlert.title}: ${e.name}`
              logoutAlert.message = e.message
            }

            // sendLogout(logoutAlert)  // TODO: ENABLE FOR PRODUCTION BECAUSE NO STRICT MODE
          }
        }

      }

      logout()

      return () => {
        abortController.abort()
      }
    }
  }, [navigate, isLoggedIn, dispatch, user, clientId])

  if (isLoggedIn) {
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
            <Typography variant="h3" gutterBottom>Logging out (please wait)...</Typography>
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
    return <Navigate to="/login" replace />
  }
}
