import { Breadcrumbs, ListItemButton } from '@mui/material'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import React from 'react'
import Divider from '@mui/material/Divider'
import { ProjectListProject, ProjectListProps } from './ProjectList.tsx'

interface ProjectListItemsProps {
  projects: ProjectListProject[],
  onClick?: ProjectListProps['onClick']
  createChildren?: (project: ProjectListProject) => React.ReactNode
}

interface ProjectListItemProps {
  namespaces: string[]
  avatar: ProjectListItemAvatar
  onClick: ()=>void
  children?: React.ReactNode
}

interface ProjectListItemAvatar {
  name: string
  src?: string
}

export default function ProjectListItems({ projects, onClick, createChildren }: ProjectListItemsProps) {
  return projects.map((project, index) => {
    function handleClick() {
      if (onClick) {
        onClick(project)
      }
    }

    const { name, nameWithNamespace, avatar: avatarSrc } = project
    const namespaces = nameWithNamespace.split(' / ')
    const avatar = {
      name,
      src: avatarSrc,
    }

    return (
      <React.Fragment key={nameWithNamespace}>
        <ProjectListItem namespaces={namespaces} avatar={avatar} onClick={handleClick}>
          { createChildren && createChildren(project) }
        </ProjectListItem>
        { index + 1 < projects.length && <Divider variant="middle" component="li" /> }
      </React.Fragment>
    )
  })
}

export function ProjectListItem({ namespaces, children, avatar, onClick }: ProjectListItemProps) {
  return (
    <ListItemButton alignItems="center" sx={{ paddingLeft: "24px", paddingRight: "24px" }} onClick={onClick}>
      <ListItemAvatar>
        <Avatar alt={avatar.name.toUpperCase()} variant="square" src={avatar.src || ' '} />
      </ListItemAvatar>
      <ListItemText primary={
        <Breadcrumbs aria-label="breadcrumb">
          { namespaces.map((namespace, index) => (
            <Typography key={index} color={index + 1 === namespaces.length ? 'text.primary' : undefined}>{ namespace }</Typography>
          )) }
        </Breadcrumbs>
      } />
      { children }
    </ListItemButton>
  )
}
