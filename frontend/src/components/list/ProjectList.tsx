import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Breadcrumbs, ListItemButton } from '@mui/material'
import React from 'react'

interface ProjectListProps {
  projects: ProjectListProject[]
}

export interface ProjectListProject {
  name: string
  nameWithNamespace: string
  avatar?: string
}

export default function ProjectList({ projects }: ProjectListProps) {
  function getProjects() {
    return projects.map((project, index) => {
      const { name, nameWithNamespace, avatar } = project
      const namespaceList = nameWithNamespace.split(' / ')

      return (
        <React.Fragment key={nameWithNamespace}>
          <ListItemButton alignItems="center" sx={{ paddingLeft: "24px", paddingRight: "24px" }}>
            <ListItemAvatar>
              <Avatar alt={name} variant="square" src={avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Breadcrumbs aria-label="breadcrumb">
                  { namespaceList.map((namespace, index) => <Typography key={index} color={index + 1 === namespaceList.length ? 'text.primary' : undefined}>{ namespace }</Typography>) }
                </Breadcrumbs>
              }
            >
            </ListItemText>
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
