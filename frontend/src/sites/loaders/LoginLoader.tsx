import GiLaPiClient from '../../libs/gilapiClient.ts'


export interface LoaderLoginData {
  gitlabs: string[]
}


export async function loginLoader(): Promise<LoaderLoginData> {
  console.log('RUN LOGIN-LOADER')
  const gilapiClient = new GiLaPiClient()

  const gitlabs = await gilapiClient.get_gitlabs()

  return {
    gitlabs,
  }
}
