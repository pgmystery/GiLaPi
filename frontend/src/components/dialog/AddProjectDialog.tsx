import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import SearchInput from '../input/SearchInput.tsx'
import { AuthContext } from '../../App.tsx'
import GitlabFetcher from '../../libs/GitlabFetcher.ts'
import { Box } from '@mui/material'
import BackdropInside from '../utils/BackdropInside.tsx'
import ProjectList, { ProjectListProject } from '../list/ProjectList/ProjectList.tsx'

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
  onClose: (project?: ProjectListProject)=>void
  excludeNamespaces?: string[]
}

export default function AddProjectDialog({ open, onClose, excludeNamespaces }: NewProjectDialogProps) {
  const { state } = useContext(AuthContext)
  const [searchText, setSearchText] = useState<string>('')
  const [projects, setProjects] = useState<ProjectListProject[]>([])
  const [selectedProject, setSelectedProject] = useState<ProjectListProject | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    async function requestProjects(gitlabFetcher: GitlabFetcher, projectsFilter: {search: string}) {
      try {
        const projects = await gitlabFetcher.getProjects(projectsFilter)

        if ('error' in projects) return []

        const projectListProjects = projects.reduce<ProjectListProject[]>((previousValue, currentValue) => {
          const { id, name, avatar_url: avatar, name_with_namespace: nameWithNamespace } = currentValue
          const returnProject: ProjectListProject = { id, name, nameWithNamespace }

          if (avatar) {
            returnProject.avatar = avatar
          }

          if (Array.isArray(excludeNamespaces)) {
            if (!excludeNamespaces.includes(nameWithNamespace)) {
              return [
                ...previousValue,
                returnProject,
              ]
            }
          } else {
            return [
              ...previousValue,
              returnProject,
            ]
          }

          return previousValue
        }, [])

        setProjects(projectListProjects)
      }
      catch (e) {
        setLoading(false)
      }

      setLoading(false)
    }

    if (searchText.length >= 3) {
      setLoading(true)
      const {user} = state

      if (user) {
        const {access_token: accessToken} = user
        const { gitlabURI } = state
        const gitlabFetcher = new GitlabFetcher(gitlabURI)
        const abortController = gitlabFetcher.newAbortController()
        gitlabFetcher.accessToken = accessToken

        const projectsFilter = {
          search: searchText
        }

        requestProjects(gitlabFetcher, projectsFilter)

        return () => {
          setLoading(false)

          abortController.abort()
        }
      }
    }
    else {
      setProjects([])
    }

    setLoading(false)
  }, [excludeNamespaces, searchText, state])

  function handleSearchInputTextChanged(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setSearchText(event.target.value)
  }

  function handleClose(project?: ProjectListProject) {
    setSearchText('')
    onClose(project)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => handleClose()}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Select a project to add it into the project-list</DialogTitle>
      <DialogContent>
        <SearchInput value={searchText} onChange={handleSearchInputTextChanged} />
        <Box>
          <BackdropInside open={loading}>
            <ProjectList projects={projects} select={{
              type: 'one',
              onChange: project => setSelectedProject(project)
            }} />
          </BackdropInside>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => selectedProject && handleClose(selectedProject)} disabled={!selectedProject || loading}>Add Project</Button>
      </DialogActions>
    </Dialog>
  )
}
