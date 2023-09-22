import React, { useState } from 'react'
import { Box, Button, Container, Paper, Toolbar, Typography } from '@mui/material'
import NewProjectDialog from '../components/dialog/NewProjectDialog'
import ProjectList from '../components/list/ProjectList'


export default function Dashboard() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container>
      <Paper>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h1" component="div" sx={{
              fontSize: '1.75rem',
            }}>
              Projects
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleClickOpen}>Add project</Button>
            <NewProjectDialog open={open} onClose={handleClose} />
          </Box>
        </Toolbar>
        <Box>
          <ProjectList />
        </Box>
      </Paper>
    </Container>
  )
}
