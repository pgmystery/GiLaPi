import List from '@mui/material/List'
import ProjectListSelectSingle, { ProjectListSelectSingleProps } from './ProjectListSelect/ProjectListSelectSingle.tsx'
import ProjectListSelectMultiple, {
  ProjectListSelectMultipleProps
} from './ProjectListSelect/ProjectListSelectMultiple.tsx'
import ProjectListItems from './ProjectListItems.tsx'

export interface ProjectListProps {
  projects: ProjectListProject[]
  select?: ProjectListPropSelectableOne | ProjectListPropSelectableMultiple
  onClick?: (project: ProjectListProject)=>void
}

interface ProjectListPropSelectableOne extends Pick<ProjectListSelectSingleProps, 'onChange'> {
  type: 'one'
}

interface ProjectListPropSelectableMultiple extends Pick<ProjectListSelectMultipleProps, 'onChange'> {
  type: 'multiple'
}

export interface ProjectListProject {
  id: number
  name: string
  nameWithNamespace: string
  avatar?: string
}

export default function ProjectList({ projects, select, onClick }: ProjectListProps) {
  function getListItems() {
    switch (select?.type) {
      case 'one':
        return <ProjectListSelectSingle projects={projects} onChange={select.onChange} />
      case 'multiple':
        return <ProjectListSelectMultiple projects={projects} onChange={select.onChange} />
      default:
        return <ProjectListItems projects={projects} onClick={onClick}/>
    }
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      { getListItems() }
    </List>
  )
}
