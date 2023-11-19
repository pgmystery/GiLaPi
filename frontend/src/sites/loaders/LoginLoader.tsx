import GilapiClient from '../../libs/GilapiClient.ts'


export interface LoaderLoginData {
  isSetupFinish: boolean
}


export async function loginLoader(): Promise<LoaderLoginData> {
  console.log('RUN LOGIN-LOADER')
  const gilapiClient = new GilapiClient()

  const isSetupFinish = await gilapiClient.check_setup()

  return {
    isSetupFinish,
  }
}
