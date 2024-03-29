export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}

export enum LoginState {
  LOGIN,
  LOGOUT,
}

interface AuthAction {
  type: LoginState
  payload?: AuthState
}

export interface AuthState {
  gitlabURI: string
  isLoggedIn: boolean
  user: AuthUser | null
  clientId?: string
  redirectURI?: string
  clientSecret?: string
}

export type AuthResponse = AuthUser | AuthError

export interface AuthUser {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  created_at: number
  username: string
  name: string
  avatar_url: string
}

interface AuthError {
  error: string
  error_description: string
}

export const authInitialState: AuthState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === 'true',
  user: JSON.parse(localStorage.getItem("user") || '{}') || null,
  gitlabURI: import.meta.env.VITE_GITLAB_URL,
  clientId: import.meta.env.VITE_GITLAB_OAUTH_CLIENT_ID,
  redirectURI: import.meta.env.VITE_GITLAB_OAUTH_REDIRECT_URI,
  clientSecret: import.meta.env.VITE_GITLAB_OAUTH_CLIENT_SECRET,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case LoginState.LOGIN: {
      localStorage.setItem("isLoggedIn", action.payload?.isLoggedIn ? 'true' : 'false')
      localStorage.setItem("user", JSON.stringify(action.payload?.user || '{}'))

      return {
        ...state,
        isLoggedIn: action.payload?.isLoggedIn || false,
        user: action.payload?.user || null
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
