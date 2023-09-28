import { AuthState } from '../../store/reducer.tsx'
import GitlabFetcher from '../../libs/GitlabFetcher.ts'
import { LoaderFunctionArgs } from 'react-router-dom'

interface PipelinesLoaderParams {
  projectId: number
}

export default function pipelinesLoader(state: AuthState) {
  async function requestProjectData({ params }: LoaderFunctionArgs) {
    if (!user) {
      return {
        project: {
          error: true,
          title: 'No authentication-data',
          message: 'No authentication-data is set',
        }
      }
    }

    const { access_token: AccessToken } = user
    const { projectId } = params as unknown as PipelinesLoaderParams

    const gitlabFetcher = new GitlabFetcher(gitlabURI, AccessToken)
    const project = await gitlabFetcher.getProjectById(projectId)  // TODO: TRY AND CATCH IF THE ACCESS_TOKEN IS EXPIRED

    if ('error' in project) {
      return {
        project: {
          error: true,
          title: project.error,
          message: project.error_description,
        }
      }
    }

    return { project }
  }

  const { gitlabURI, user } = state

  return requestProjectData
}
