interface SetupFinishData {
  gitlabs: SetupFinishGitlabsData[]
}

interface SetupFinishGitlabsData {
  name: string
  url: string
  redirect_url: string
  admin: {
    name: string
    client_id: string
  }
}

export default class GilapiClient {
  public abortController: AbortController

  constructor() {
    this.abortController = this.newAbortController()
  }

  async get_gitlabs(): Promise<string[]> {
    return new Promise((resolve) => {
      resolve([])
    })
  }

  async sendSetup(data: SetupFinishData) {
    const urlPath = '/setup'

    await this.post(urlPath)
  }

  private async post(url: string) {
    const response = await fetch(url, {
      method: 'POST',
      signal: this.abortController.signal,
    })

    return await response.json()
  }

  newAbortController() {
    this.abortController = new AbortController()

    return this.abortController
  }
}
