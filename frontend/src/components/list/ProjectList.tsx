import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Breadcrumbs, Checkbox, ListItemButton, ListItemIcon, Radio } from '@mui/material'
import React, { useState } from 'react'

interface ProjectListProps {
  projects: ProjectListProject[]
  select?: ProjectListPropSelectableOne | ProjectListPropSelectableMultiple
}

interface ProjectListPropSelectableOne {
  type: 'one'
  onChange: (project: ProjectListProject)=>void
}

interface ProjectListPropSelectableMultiple {
  type: 'multiple'
  onChange: (projects: ProjectListProject[])=>void
}

export interface ProjectListProject {
  name: string
  nameWithNamespace: string
  avatar?: string
}

export default function ProjectList({ projects, select }: ProjectListProps) {
  const [singleSelectedProject, setSingleSelectedProject] = useState<ProjectListProject | null>(null)
  const [multipleSelectedProjects, setMultipleSelectedProjects] = useState<ProjectListProject[]>([])

  function getProjects() {
    return projects.map((project, index) => {
      const { name, nameWithNamespace, avatar } = project
      const namespaceList = nameWithNamespace.split(' / ')

      function handleSelectClick() {
        switch (select?.type) {
          case 'one':
            setSingleSelectedProject(project)
            select?.onChange(project)

            break
          case 'multiple':
            if (multipleSelectedProjects.includes(project)) {
              const index = multipleSelectedProjects.indexOf(project)
              const newSelectedProjects = [
                ...multipleSelectedProjects.slice(0, index),
                ...multipleSelectedProjects.slice(index + 1, multipleSelectedProjects.length),
              ]

              setMultipleSelectedProjects(newSelectedProjects)
              select?.onChange(newSelectedProjects)
            }
            else {
              const newSelectedProjects = [
                ...multipleSelectedProjects,
                project,
              ]

              setMultipleSelectedProjects(newSelectedProjects)
              select?.onChange(newSelectedProjects)
            }

            break
        }
      }

      function getSelectComponent() {
        switch (select?.type) {
          case 'one':
            return (
              <ListItemIcon>
                <Radio
                  checked={singleSelectedProject === project}
                  onChange={handleSelectClick}
                  value={project.nameWithNamespace}
                  name="radio-buttons"
                />
              </ListItemIcon>
            )
          case 'multiple':
            return (
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={multipleSelectedProjects.includes(project)}
                  onChange={handleSelectClick}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
            )
        }
      }

      return (
        <React.Fragment key={nameWithNamespace}>
          <ListItemButton alignItems="center" sx={{ paddingLeft: "24px", paddingRight: "24px" }} onClick={handleSelectClick}>
            <ListItemAvatar>
              <Avatar alt={name} variant="square" src={avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Breadcrumbs aria-label="breadcrumb">
                  { namespaceList.map((namespace, index) => <Typography key={index} color={index + 1 === namespaceList.length ? 'text.primary' : undefined}>{ namespace }</Typography>) }
                </Breadcrumbs>
              }
            />
            { getSelectComponent() }
          </ListItemButton>
          { index + 1 < projects.length && <Divider variant="middle" component="li" /> }
        </React.Fragment>
      )
    })
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      { getProjects() }
    </List>
  )
}
