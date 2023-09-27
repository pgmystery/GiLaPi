import ProjectListItems from './ProjectListItems.tsx'
import { ProjectListProject } from './ProjectList.tsx'
import { IconButton, ListItemIcon } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import List from '@mui/material/List'

export const projectListDeleteIconColor = '#ff1e48'

interface ProjectListDeleteProps {
  projects: ProjectListProject[]
  onClick: (project: ProjectListProject)=>void
  iconColor?: string
}

export default function ProjectListDelete({ projects, onClick, iconColor }: ProjectListDeleteProps) {
  function handleCreateChildren(project: ProjectListProject) {
    return (
      <ListItemIcon>
        <IconButton aria-label="delete" onClick={() => onClick(project)}>
          <DeleteIcon sx={{
            color: iconColor || projectListDeleteIconColor,
          }} />
        </IconButton>
      </ListItemIcon>
    )
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <ProjectListItems projects={projects} createChildren={handleCreateChildren} />
    </List>
  )
}
