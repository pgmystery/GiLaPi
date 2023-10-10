import { createContext, useReducer } from 'react'
import './App.css'
import Projects from './sites/Projects.tsx'
import { authReducer, authInitialState, AuthContextType } from './store/reducer'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './sites/Login.tsx'
import Redirect from './sites/oauth/Redirect.tsx'
import Logout from './sites/Logout.tsx'
import LoggedInLayout from './components/layout/LoggedInLayout.tsx'
import Pipelines from './sites/project/Pipelines.tsx'
import pipelinesLoader from './sites/project/PipelinesLoader.tsx'
import { loginLoader } from './sites/loaders/LoginLoader.tsx'
import Setup from './sites/Setup.tsx'


export const AuthContext = createContext<AuthContextType>({
  state: authInitialState,
  dispatch: ()=> {},
})


function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState)

  const router = createBrowserRouter([
    {
      path: '/setup',
      element: <Setup />,
    },
    {
      path: '/login',
      element: <Login />,
      loader: loginLoader,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/oauth/redirect',
      element: <Redirect />,
    },
    {
      element: <LoggedInLayout />,
      children: [
        {
          path: '/',
          element: <Projects />,
        },
        {
          path: '/project/:projectId',
          element: <Pipelines />,
          loader: pipelinesLoader(authState),
        },
      ]
    },

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
