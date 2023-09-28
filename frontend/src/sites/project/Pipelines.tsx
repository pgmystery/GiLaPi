import { Navigate, useLoaderData } from 'react-router-dom'
import { PipelinesLoaderReturn } from './PipelinesLoader.tsx'


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
  else if ('message' in project) {
    // TODO: NOT NAVIGATE TO LOGIN
    return <Navigate to="/login" replace state={{
      alert: {
        severity: 'error',
        title: 'Error',
        message: project.message,
      },
    }} />
  }

  const { name_with_namespace: nameWithNamespaces } = project

  return (
    <h1>Pipelines for project "{ nameWithNamespaces }"</h1>
  )
}
