import { useContext, useEffect, useState } from 'react'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import AddProjectDialog from '../components/dialog/AddProjectDialog.tsx'
import ProjectList, { ProjectListProject } from '../components/list/ProjectList'
import SearchInput from '../components/input/SearchInput'
import { AuthContext } from '../App.tsx'
import GitlabFetcher from '../libs/GitlabFetcher.ts'
import { useNavigate } from 'react-router-dom'


export default function Projects() {
  const { state } = useContext(AuthContext)
  const [projects, setProjects] = useState<ProjectListProject[]>([])
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProjects(gitlabFetcher: GitlabFetcher) {
      const result = await gitlabFetcher.getProjects()

      const projects = result.map(project => {
        return {
          name: project.name,
          nameWithNamespace: project.name_with_namespace,
          avatar: project.avatar_url,
        } as ProjectListProject
      })

      setProjects(projects)
    }

    const { user, gitlabURI } = state

    if (user) {
      const { access_token: accessToken } = user
      const gitlabFetcher = new GitlabFetcher(gitlabURI, accessToken)

      fetchProjects(gitlabFetcher)
    }
    else {
      navigate('/login', {
        replace: true,
      })
    }

  }, [state, navigate])

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = (project: ProjectListProject) => {
    setOpen(false)

    console.log(project)
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
          <AddProjectDialog open={open} onClose={handleClose} />
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
