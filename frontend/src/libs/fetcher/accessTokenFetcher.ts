import GitlabFetcher, { GitlabFetcherDataError } from '../GitlabFetcher.ts'
import { AuthUser } from '../../store/reducer.tsx'

interface AccessTokenFetcherFetchProps {
  codeData: string
  redirectURL: string
  clientId: string
}

export default class AccessTokenFetcher {
  public fetcher: GitlabFetcher

  constructor(gitlabURL: string) {
    this.fetcher = new GitlabFetcher(gitlabURL)
  }

  async fetch({ codeData, redirectURL, clientId }: AccessTokenFetcherFetchProps): Promise<AuthUser> {
    const accessTokenData = await this.fetcher.requestAccessToken(
      clientId,
      codeData,
      redirectURL
    )

    if ('error' in accessTokenData) throw GitlabFetcherDataError(accessTokenData)

    const userData = await this.fetcher.getUserInfo()

    if ('error' in userData) throw GitlabFetcherDataError(userData)

    const { username, name, avatar_url } = userData

    return {
      ...accessTokenData,
      username,
      name,
      avatar_url,
    }
  }
}
