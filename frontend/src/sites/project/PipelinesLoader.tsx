import { AuthState } from '../../store/reducer.tsx'
import GitlabFetcher, {
  GitlabFetcherProjectInfo,
} from '../../libs/GitlabFetcher.ts'
import { LoaderFunctionArgs } from 'react-router-dom'

export interface PipelinesLoaderParams {
  projectId: number
}

export interface PipelinesLoaderReturn {
  project: GitlabFetcherProjectInfo | PipelinesLoaderError
  pipelines: Awaited<ReturnType<GitlabFetcher['getProjectsPipeline']>>
}

export interface PipelinesLoaderError {
  error: true
  title: string
  message: string
}

export default function pipelinesLoader(state: AuthState) {
  async function requestProjectData({ params }: LoaderFunctionArgs): Promise<PipelinesLoaderReturn | PipelinesLoaderError> {
    if (!user) {
      return {
        error: true,
        title: 'No authentication-data',
        message: 'No authentication-data is set',
      }
    }

    const { access_token: AccessToken } = user
    const { projectId } = params as unknown as PipelinesLoaderParams

    const gitlabFetcher = new GitlabFetcher(gitlabURI, AccessToken)
    const project = await gitlabFetcher.getProjectById(projectId)  // TODO: TRY AND CATCH IF THE ACCESS_TOKEN IS EXPIRED

    if ('error' in project) {
      return {
        error: true,
        title: project.error,
        message: project.error_description,
      }
    }

    const pipelines = await gitlabFetcher.getProjectsPipeline(projectId, {
      getJobs: true,
      getBridges: true,
    })

    return { project, pipelines }
  }

  const { gitlabURI, user } = state

  return requestProjectData
}
