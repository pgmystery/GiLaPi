import { useState } from 'react'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import NewProjectDialog from '../components/dialog/NewProjectDialog'
import ProjectList from '../components/list/ProjectList'
import SearchInput from '../components/input/SearchInput'


export default function Dashboard() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
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
      <Toolbar>
        <SearchInput />
      </Toolbar>
      <Box>
        <ProjectList />
      </Box>
    </>
  )
}
