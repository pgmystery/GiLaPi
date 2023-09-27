import List from '@mui/material/List'
import ProjectListSelectSingle, { ProjectListSelectSingleProps } from './ProjectListSelect/ProjectListSelectSingle.tsx'
import ProjectListSelectMultiple from './ProjectListSelect/ProjectListSelectMultiple.tsx'
import ProjectListItems from './ProjectListItems.tsx'

export interface ProjectListProps {
  projects: ProjectListProject[]
  select?: ProjectListPropSelectableOne | ProjectListPropSelectableMultiple
  onClick?: (project: ProjectListProject)=>void
}

interface ProjectListPropSelectableOne extends Pick<ProjectListSelectSingleProps, 'onChange'> {
  type: 'one'
}

interface ProjectListPropSelectableMultiple {
  type: 'multiple'
  onChange: (projects: ProjectListProject[])=>void
}

export interface ProjectListProject {
  name: string
  nameWithNamespace: string
  avatar?: string
}

export default function ProjectList({ projects, select, onClick }: ProjectListProps) {
  // const [singleSelectedProject, setSingleSelectedProject] = useState<ProjectListProject | null>(null)
  // const [multipleSelectedProjects, setMultipleSelectedProjects] = useState<ProjectListProject[]>([])

  // function getProjects() {
  //   let foundSelectedProject = false
  //
  //   const projectComponents =  projects.map((project, index) => {
  //     const { name, nameWithNamespace, avatar } = project
  //     const namespaceList = nameWithNamespace.split(' / ')
  //
  //     function handleSelectClick() {
  //       switch (select?.type) {
  //         case 'one':
  //           setSingleSelectedProject(project)
  //           select?.onChange(project)
  //
  //           break
  //         case 'multiple':
  //           if (multipleSelectedProjects.includes(project)) {
  //             const index = multipleSelectedProjects.indexOf(project)
  //             const newSelectedProjects = [
  //               ...multipleSelectedProjects.slice(0, index),
  //               ...multipleSelectedProjects.slice(index + 1, multipleSelectedProjects.length),
  //             ]
  //
  //             setMultipleSelectedProjects(newSelectedProjects)
  //             select?.onChange(newSelectedProjects)
  //           }
  //           else {
  //             const newSelectedProjects = [
  //               ...multipleSelectedProjects,
  //               project,
  //             ]
  //
  //             setMultipleSelectedProjects(newSelectedProjects)
  //             select?.onChange(newSelectedProjects)
  //           }
  //
  //           break
  //       }
  //     }
  //
  //     function getSelectComponent() {
  //       let currentProjectIsSelectedProject = false
  //
  //       switch (select?.type) {
  //         case 'one':
  //           currentProjectIsSelectedProject = JSON.stringify(singleSelectedProject) === JSON.stringify(project)
  //
  //           if (!foundSelectedProject && currentProjectIsSelectedProject) {
  //             foundSelectedProject = currentProjectIsSelectedProject
  //           }
  //
  //           return (
  //             <ListItemIcon>
  //               <Radio
  //                 checked={foundSelectedProject}
  //                 onChange={handleSelectClick}
  //                 value={project.nameWithNamespace}
  //                 name="radio-buttons"
  //               />
  //             </ListItemIcon>
  //           )
  //         case 'multiple':
  //           foundSelectedProject = multipleSelectedProjects.includes(project)  // TODO: not rly working because of js deep compare?
  //
  //           return (
  //             <ListItemIcon>
  //               <Checkbox
  //                 edge="start"
  //                 checked={foundSelectedProject}
  //                 onChange={handleSelectClick}
  //                 tabIndex={-1}
  //                 disableRipple
  //               />
  //             </ListItemIcon>
  //           )
  //       }
  //     }
  //
  //     return (
  //       <React.Fragment key={nameWithNamespace}>
  //         <ListItemButton alignItems="center" sx={{ paddingLeft: "24px", paddingRight: "24px" }} onClick={handleSelectClick}>
  //           <ListItemAvatar>
  //             <Avatar alt={name} variant="square" src={avatar} />
  //           </ListItemAvatar>
  //           <ListItemText
  //             primary={
  //               <Breadcrumbs aria-label="breadcrumb">
  //                 { namespaceList.map((namespace, index) => <Typography key={index} color={index + 1 === namespaceList.length ? 'text.primary' : undefined}>{ namespace }</Typography>) }
  //               </Breadcrumbs>
  //             }
  //           />
  //           { getSelectComponent() }
  //         </ListItemButton>
  //         { index + 1 < projects.length && <Divider variant="middle" component="li" /> }
  //       </React.Fragment>
  //     )
  //   })
  // }

  function getListItems() {
    switch (select?.type) {
      case 'one':
        return <ProjectListSelectSingle projects={projects} onChange={select.onChange} />
      case 'multiple':
        return <ProjectListSelectMultiple />
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
