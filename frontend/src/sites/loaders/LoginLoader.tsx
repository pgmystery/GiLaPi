import GiLaPiClient from '../../libs/gilapiClient.ts'


export interface LoaderLoginData {
  gitlabs: string[]
}


export async function loginLoader(): Promise<LoaderLoginData> {
  const gilapiClient = new GiLaPiClient()

  const gitlabs = await gilapiClient.get_gitlabs()

  return {
    gitlabs,
  }
}
