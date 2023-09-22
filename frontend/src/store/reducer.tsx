export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}

enum LoginState {
  LOGIN,
  LOGOUT,
}

interface AuthAction {
  type: LoginState
  payload: AuthState
}

export interface AuthState {
  isLoggedIn: boolean
  user: string | null
  clientId?: string
  redirectURI?: string
  clientSecret?: string
}

export const authInitialState: AuthState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn") || '{}') || false,
  user: JSON.parse(localStorage.getItem("user") || '{}') || null,
  clientId: import.meta.env.VITE_GITLAB_OAUTH_CLIENT_ID,
  redirectURI: import.meta.env.VITE_GITLAB_OAUTH_REDIRECT_URI,
  clientSecret: import.meta.env.VITE_GITLAB_OAUTH_CLIENT_SECRET,
  // proxy_url: import.meta.env.GITLAB_OAUTH_PROXY_URL
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case LoginState.LOGIN: {
      localStorage.setItem("isLoggedIn", JSON.stringify(action.payload.isLoggedIn))
      localStorage.setItem("user", JSON.stringify(action.payload.user))

      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user
      }
    }
    case LoginState.LOGOUT: {
      localStorage.clear()

      return {
        ...state,
        isLoggedIn: false,
        user: null
      }
    }
    default:
      return state
  }
}
