import { useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, DialogContentText, Toolbar, Typography } from '@mui/material'
import AddProjectDialog from '../components/dialog/AddProjectDialog.tsx'
import SearchInput from '../components/input/SearchInput'
import { ProjectListProject } from '../components/list/ProjectList/ProjectList.tsx'
import ProjectListDelete, { projectListDeleteIconColor } from '../components/list/ProjectList/ProjectListDelete.tsx'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useNavigate } from 'react-router-dom'


export default function Projects() {
  const [projects, setProjects] = useState<ProjectListProject[]>([])
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false)
  const [confirmDeleteProjectOpen, setConfirmDeleteProjectOpen] = useState<ProjectListProject | null>(null)
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setAddProjectDialogOpen(true)
  }

  const handleClose = (project?: ProjectListProject) => {
    setAddProjectDialogOpen(false)

    if (project) {
      if (!projects.includes(project)) {
        setProjects([
          ...projects,
          project,
        ])
      }
    }
  }

  function handleProjectDeleteClick(project: ProjectListProject) {
    setConfirmDeleteProjectOpen(project)
  }

  function deleteProjectFromListConfirm() {
    if (confirmDeleteProjectOpen !== null) {
      const newProjects = projects.filter(oldProject => oldProject.nameWithNamespace !== confirmDeleteProjectOpen.nameWithNamespace)

      setProjects(newProjects)
      setConfirmDeleteProjectOpen(null)
    }
  }

  function handleProjectListItemClick(project: ProjectListProject) {
    setShowLoadingSpinner(true)
    navigate(`/project/${project.id}`)
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
          <AddProjectDialog open={addProjectDialogOpen} onClose={handleClose} excludeNamespaces={projects.map(project => project.nameWithNamespace)} />
        </Box>
      </Toolbar>
      <Toolbar>
        <SearchInput />
      </Toolbar>
      <Box>
        <ProjectListDelete projects={projects} onDeleteClick={handleProjectDeleteClick} onClick={handleProjectListItemClick} />
        <Dialog
          open={confirmDeleteProjectOpen !== null}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableRestoreFocus
        >
          <DialogTitle id="alert-dialog-title">
            Confirm delete project from list
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the project "{confirmDeleteProjectOpen?.nameWithNamespace}" from the project-list?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteProjectOpen(null)}>Cancel</Button>
            <Button onClick={deleteProjectFromListConfirm} autoFocus sx={{
              color: projectListDeleteIconColor,
            }}>Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoadingSpinner}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
