import { ProjectListProject } from '../ProjectList.tsx'
import { useEffect, useState } from 'react'
import ProjectListItems from '../ProjectListItems.tsx'
import ListItemIcon from '@mui/material/ListItemIcon'
import { Checkbox } from '@mui/material'

export interface ProjectListSelectMultipleProps {
  projects: ProjectListProject[]
  onChange?: (selectedProjects: ProjectListProject[])=>void
}

export default function ProjectListSelectMultiple({ projects, onChange }: ProjectListSelectMultipleProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  useEffect(() => {
    if (selectedProjects.length > 0) {
      const { newNamespaces, newProjects } = selectedProjects.reduce<{newNamespaces: string[], newProjects: ProjectListProject[]}>((previousValue, currentValue) => {
        const newProject = projects.find(project => project.nameWithNamespace === currentValue)

        if (newProject) {
          const newNamespaces = [
              ...previousValue.newNamespaces,
            currentValue,
            ]
          const newProjects = [
            ...previousValue.newProjects,
            newProject,
          ]

          return {
            newNamespaces,
            newProjects,
          }
        }

        return previousValue
      }, {
        newNamespaces: [],
        newProjects: [],
      })

      setSelectedProjects(newNamespaces)
      if (onChange) {
        onChange(newProjects)
      }
    }
  }, [projects])

  function handleItemClick(project: ProjectListProject) {
    function convertNamespaceToProjects(namespaces: string[]): ProjectListProject[] {
      return projects.filter(project => namespaces.includes(project.nameWithNamespace))
    }

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
