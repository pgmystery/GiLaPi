import { createContext, useReducer } from 'react'
import './App.css'
import Dashboard from './sites/Dashboard'
import { authReducer, authInitialState, AuthContextType } from './store/reducer'
import { Navigate, Route, Routes, BrowserRouter, Outlet } from 'react-router-dom'
import Login from './sites/Login.tsx'
import Redirect from './sites/oauth/Redirect.tsx'
import Logout from './sites/Logout.tsx'


export const AuthContext = createContext<AuthContextType>({
  state: authInitialState,
  dispatch: ()=> {},
})


function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)

  function ProtectedRoute() {
    if (!authState.isLoggedIn) {
      return <Navigate to="/login" />
    }

    return <Outlet />
  }

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
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App
