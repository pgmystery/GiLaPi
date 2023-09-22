import React from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { Breadcrumbs, Link, ListItemButton } from '@mui/material'


export default function ProjectList() {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ListItemButton alignItems="center">
        <ListItemAvatar>
          <Avatar alt="Test" variant="square" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Breadcrumbs aria-label="breadcrumb">
              <Typography>Test</Typography>
              <Typography color="text.primary">Test</Typography>
            </Breadcrumbs>
          }
        >
        </ListItemText>
      </ListItemButton>
      <Divider variant="middle" component="li" />
      <ListItemButton alignItems="center">
        <ListItemAvatar>
          <Avatar alt="Test2" variant="square" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Breadcrumbs aria-label="breadcrumb">
              <Typography>Test</Typography>
              <Typography color="text.primary">Test2</Typography>
            </Breadcrumbs>
          }
        >
        </ListItemText>
      </ListItemButton>
      <Divider variant="middle" component="li" />
      <ListItemButton alignItems="center">
        <ListItemAvatar>
          <Avatar alt="SCAM" variant="square" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">Marvel Media GmbH</Link>
              <Link underline="hover" color="text.primary" href="/">SCAM</Link>
            </Breadcrumbs>
          }
        >
        </ListItemText>
      </ListItemButton>
    </List>
  )
}
