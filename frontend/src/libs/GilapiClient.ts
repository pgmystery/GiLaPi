export interface SetupFinishData {
  gitlabs: SetupFinishGitlabsData[]
}

export interface SetupFinishGitlabsData {
  name: string
  url: string
  redirect_url: string
  admin?: {
    name: string
    client_id: string
  }
}

export default class GilapiClient {
  public apiURL: string
  public abortController: AbortController

  constructor() {
    this.apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    this.abortController = this.newAbortController()
  }

  async check_setup() {
    const urlPath = '/setup'

    const response = await this.get(urlPath)
    const responseText = await response.text()

    return responseText === 'true'
  }

  async sendSetup(data: SetupFinishData) {
    const urlPath = '/setup'

    const response = await this.post(urlPath, data)

    if (response.status !== 201) {
      throw new Error('Unknown Error')
    }
  }

  private async post(url: string, body: unknown) {
    const response = await fetch(this.apiURL + url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: this.abortController.signal,
    })

    return response
  }

  private async get(url: string) {
    const response = await fetch(this.apiURL + url, {
      method: 'GET',
      signal: this.abortController.signal,
    })

    return response
  }

  newAbortController() {
    this.abortController = new AbortController()

    return this.abortController
  }
}
