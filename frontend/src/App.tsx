import { createContext, useReducer } from 'react'
import './App.css'
import Dashboard from './sites/Dashboard'
import { authReducer, authInitialState, AuthContextType } from './store/reducer'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './sites/Login.tsx'


export const AuthContext = createContext<AuthContextType>({
  state: authInitialState,
  dispatch: ()=> {},
})


// https://medium.com/@princewilliroka/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc


function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <Dashboard />,
    }
  ])

  return (
    <AuthContext.Provider value={{
      state: authState,
      dispatch: authDispatch,
    }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  )
}

export default App
