import { createContext, useReducer } from 'react'
import './App.css'
import Dashboard from './sites/Dashboard'
import { authReducer, authInitialState, AuthContextType } from './store/reducer'


export const AuthContext = createContext<AuthContextType | null>(null)


// https://medium.com/@princewilliroka/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc


function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)

  return (
    <AuthContext.Provider value={{
      state: authState,
      dispatch: authDispatch,
    }}>
      <Dashboard />
    </AuthContext.Provider>
  )
}

export default App
