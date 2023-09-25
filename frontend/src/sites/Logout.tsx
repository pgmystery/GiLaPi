import { useContext } from 'react'
import { AuthContext } from '../App.tsx'
import { LoginState } from '../store/reducer.tsx'
import { Navigate } from 'react-router-dom'


export default function Logout() {
  const { dispatch } = useContext(AuthContext)

  dispatch({
    type: LoginState.LOGOUT,
  })

  return <Navigate to="/login" replace={true} state={{
    alert: {
      severity: 'success',
      title: 'Logout',
      message: 'Successfully logged out'
    }
  }} />
}
