import { useState } from 'react'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import AddProjectDialog from '../components/dialog/AddProjectDialog.tsx'
import SearchInput from '../components/input/SearchInput'
import ProjectList, { ProjectListProject } from '../components/list/ProjectList/ProjectList.tsx'


export default function Projects() {
  const [projects, setProjects] = useState<ProjectListProject[]>([])
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (project?: ProjectListProject) => {
    setOpen(false)

    if (project) {
      if (!projects.includes(project)) {
        setProjects([
          ...projects,
          project,
        ])
      }
    }
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
          <AddProjectDialog open={open} onClose={handleClose} excludeNamespaces={projects.map(project => project.nameWithNamespace)} />
        </Box>
      </Toolbar>
      <Toolbar>
        <SearchInput />
      </Toolbar>
      <Box>
        <ProjectList projects={projects} />
      </Box>
    </>
  )
}
