export interface GitlabFetcherErrorData {
  error: string
  error_description: string
}

export interface GitlabFetcherAccessTokenData {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  created_at: number
}

export interface GitlabFetcherUserInfo {
  id: number,
  username: string,
  name: string,
  state: string,
  avatar_url: string,
  web_url: string,
  created_at: string,
  bio: string,
  location: string,
  public_email: string | null,
  skype: string,
  linkedin: string,
  twitter: string,
  discord: string,
  website_url: string,
  organization: string,
  job_title: string,
  pronouns: string | null,
  bot: boolean,
  work_information: string | null,
  local_time: string | null,
  last_sign_in_at: string,
  confirmed_at: string,
  last_activity_on: string,
  email: string,
  theme_id: number,
  color_scheme_id: number,
  projects_limit: number,
  current_sign_in_at: string,
  identities: string[],
  can_create_group: boolean,
  can_create_project: boolean,
  two_factor_enabled: boolean,
  external: boolean,
  private_profile: boolean,
  commit_email: string,
  is_admin: boolean,
  note: string | null,
  namespace_id: number,
  created_by: string | null
}

interface GitlabFetcherFetchOptions {
  method?: string
  isJSON?: boolean
}

export class NoAccessTokenException extends Error {}

const defaultFetchOptions: GitlabFetcherFetchOptions = {
  method: 'GET',
  isJSON: true,
}

export default class GitlabFetcher {
  public gitlabURI: string
  public accessToken?: string
  public abortController: AbortController

  constructor(gitlabURI: string, accessToken?: string) {
    this.gitlabURI = gitlabURI
    this.accessToken = accessToken

    this.abortController = this.newAbortController()
  }

  newAbortController() {
    this.abortController = new AbortController()

    return this.abortController
  }

  async requestAccessToken(clientId: string, code: string, redirectURL: string) {
    const url = `${this.gitlabURI}/oauth/token?client_id=${clientId}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectURL}`

    const result = await this._fetch(url, {
      method: 'POST',
    })

    if ('access_token' in result) {
      this.accessToken = result.access_token
    }

    return result as GitlabFetcherAccessTokenData | GitlabFetcherErrorData
  }

  async getUserInfo() {
    if (!this.accessToken) {
      throw new NoAccessTokenException('AccessToken is required for this request')
    }

    const url = `${this.gitlabURI}/api/v4/user?access_token=${this.accessToken}`

    const result = await this._fetch(url)

    return result as GitlabFetcherUserInfo | GitlabFetcherErrorData
  }

  private async _fetch(url: string, options: GitlabFetcherFetchOptions = defaultFetchOptions) {
    options = {
      ...defaultFetchOptions,
      ...options,
    }
    const { method, isJSON } = options

    const response = await fetch(url, {
      method,
      signal: this.abortController.signal,
    })

    if (isJSON) {
      return await response.json()
    }

    return await response.text()
  }

  getAuthorizeURL(clientId: string, redirectURI: string, scope: string[]) {
    const scopeString = scope.join('+')
    const url = `${this.gitlabURI}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&state=STATE&scope=${scopeString}`

    return url
  }
}
