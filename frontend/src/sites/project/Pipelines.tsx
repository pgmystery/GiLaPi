import { GitlabFetcherProjectInfo } from '../../libs/GitlabFetcher.ts'
import { Navigate, useLoaderData } from 'react-router-dom'

interface PipelinesLoaderError {
  error: true
  title: string
  message: string
}

interface PipelinesLoaderReturn {
  project: GitlabFetcherProjectInfo | PipelinesLoaderError
}

export default function Pipelines() {
  const { project } = useLoaderData() as PipelinesLoaderReturn

  console.log('project')
  console.log(project)

  if ('error' in project) {
    return <Navigate to="/login" replace state={{
      alert: {
        severity: 'error',
        title: project.title,
        message: project.message,
      },
    }} />
  }

  return (
    <h1>Pipelines for project "{ project.name_with_namespace }"</h1>
  )
}
