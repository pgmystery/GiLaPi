import { useEffect, useState } from 'react'
import { ProjectListProject } from '../ProjectList.tsx'
import ProjectListItems from '../ProjectListItems.tsx'
import { ListItemIcon, Radio } from '@mui/material'


export interface ProjectListSelectSingleProps {
  projects: ProjectListProject[]
  onChange?: (project: ProjectListProject | null)=>void
}

export default function ProjectListSelectSingle({ projects, onChange }: ProjectListSelectSingleProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  useEffect(() => {
    if (selectedProject) {
      const selectedProjectIsInProjects = projects.some(project => project.nameWithNamespace === selectedProject)

      if (!selectedProjectIsInProjects) {
        setSelectedProject(null)
        if (onChange) {
          onChange(null)
        }
      }
    }
  }, [selectedProject, projects, onChange])

  function handleItemClick(project: ProjectListProject | null) {
    if (project === null) {
      setSelectedProject(null)
    }
    else {
      const { nameWithNamespace } = project

      setSelectedProject(nameWithNamespace)
    }

    if (onChange) {
      onChange(project)
    }
  }

  function handleCreateChildren(project: ProjectListProject) {
    const { nameWithNamespace } = project
    const projectIsSelectedProject = JSON.stringify(selectedProject) === JSON.stringify(nameWithNamespace)

    return (
      <ListItemIcon>
        <Radio
          checked={projectIsSelectedProject}
          value={nameWithNamespace}
          name="radio-buttons"
        />
      </ListItemIcon>
    )
  }

  return (
    <ProjectListItems projects={projects} onClick={handleItemClick} createChildren={handleCreateChildren} />
  )
}
