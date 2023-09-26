import { createContext, useReducer } from 'react'
import './App.css'
import Projects from './sites/Projects.tsx'
import { authReducer, authInitialState, AuthContextType } from './store/reducer'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Login from './sites/Login.tsx'
import Redirect from './sites/oauth/Redirect.tsx'
import Logout from './sites/Logout.tsx'
import LoggedInLayout from './components/layout/LoggedInLayout.tsx'


export const AuthContext = createContext<AuthContextType>({
  state: authInitialState,
  dispatch: ()=> {},
})


function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)

  return (
    <AuthContext.Provider value={{
      state: authState,
      dispatch: authDispatch,
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/oauth/redirect" element={<Redirect />} />
          <Route element={<LoggedInLayout />}>
            <Route path="/" element={<Projects />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
