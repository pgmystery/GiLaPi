import GilapiClient from '../../libs/GilapiClient.ts'
import { redirect } from 'react-router-dom'


export async function setupLoader() {
  const gilapiClient = new GilapiClient()

  const isSetupFinish = await gilapiClient.check_setup()

  if (isSetupFinish) {
    redirect('/login')
  }

  return null
}
