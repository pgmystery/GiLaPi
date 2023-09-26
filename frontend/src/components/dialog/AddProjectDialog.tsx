import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import ProjectList, { ProjectListProject } from '../list/ProjectList.tsx'
import SearchInput from '../input/SearchInput.tsx'
import { AuthContext } from '../../App.tsx'
import GitlabFetcher from '../../libs/GitlabFetcher.ts'
import { Box } from '@mui/material'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />
})

interface NewProjectDialogProps {
  open: boolean
  onClose: (project: ProjectListProject)=>void
}

export default function AddProjectDialog({ open, onClose }: NewProjectDialogProps) {
  const { state } = useContext(AuthContext)
  const [searchText, setSearchText] = useState<string>('')
  const [projects, setProjects] = useState<ProjectListProject[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectListProject | null>(null)
  const {gitlabURI} = state
  const gitlabFetcher = new GitlabFetcher(gitlabURI)

  async function handleSearchTextChange(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    const newSearchText = event.target.value
    setSearchText(newSearchText)

    if (newSearchText.length >= 3) {
      const {user} = state
      if (user) {
        const {access_token: accessToken} = user
        gitlabFetcher.accessToken = accessToken

        const projectsFilter = {
          search: newSearchText
        }
        const projects = await gitlabFetcher.getProjects(projectsFilter)
        console.log(projects)
        const projectListProjects = projects.map(({ name, avatar_url: avatar, name_with_namespace: nameWithNamespace }) => ({ name, avatar, nameWithNamespace } as ProjectListProject))

        setProjects(projectListProjects)
      }
    }
    else {
      setProjects([])
    }
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Select a project to add it into the project-list</DialogTitle>
      <DialogContent>
        <SearchInput value={searchText} onChange={handleSearchTextChange} />
        <Box>
          <ProjectList projects={projects} select={{
            type: 'one',
            onChange: project => setSelectedProject(project)
          }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => selectedProject && onClose(selectedProject)} disabled={!selectedProject}>Add Project</Button>
      </DialogActions>
    </Dialog>
  )
}
