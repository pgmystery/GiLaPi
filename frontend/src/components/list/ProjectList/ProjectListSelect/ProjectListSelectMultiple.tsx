import { ProjectListProject } from '../ProjectList.tsx'
import { useState } from 'react'
import ProjectListItems from '../ProjectListItems.tsx'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Checkbox } from '@mui/material'


export interface ProjectListSelectMultipleProps {
  projects: ProjectListProject[]
  onChange?: (selectedProjects: ProjectListProject[])=>void
}

export default function ProjectListSelectMultiple({ projects, onChange }: ProjectListSelectMultipleProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  function handleItemClick(project: ProjectListProject) {
    const { nameWithNamespace } = project

    let newSelectedNamespaces: string[]

    if (selectedProjects.includes(nameWithNamespace)) {
      const index = selectedProjects.indexOf(nameWithNamespace)
      newSelectedNamespaces = [
        ...selectedProjects.slice(0, index),
        ...selectedProjects.slice(index + 1, selectedProjects.length),
      ]
    }
    else {
      newSelectedNamespaces = [
        ...selectedProjects,
        nameWithNamespace,
      ]
    }

    setSelectedProjects(newSelectedNamespaces)

    if (onChange) {
      const newSelectedProjects = convertNamespaceToProjects(newSelectedNamespaces)
      onChange(newSelectedProjects)
    }
  }

  function convertNamespaceToProjects(namespaces: string[]): ProjectListProject[] {

  }

  function handleCreateChildren(project: ProjectListProject) {
    const { nameWithNamespace } = project
    const foundSelectedProject = selectedProjects.includes(nameWithNamespace)

    return (
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={foundSelectedProject}
          tabIndex={-1}
          disableRipple
        />
      </ListItemIcon>
    )
  }

  return (
    <ProjectListItems projects={projects} onClick={handleItemClick} createChildren={handleCreateChildren} />
  )
}
