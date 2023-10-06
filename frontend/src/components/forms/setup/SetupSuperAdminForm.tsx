import { SetupStageFormProps } from '../../../sites/Setup.tsx'
import { GitlabsListData } from './SetupGitlabsForm.tsx'
import { Box, IconButton, ListItem, ListItemButton } from '@mui/material'
import List from '@mui/material/List'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import { useState } from 'react'
import Typography from '@mui/material/Typography'


export type SuperAdminData = unknown

interface SetupSuperAdminForm extends SetupStageFormProps<SuperAdminData> {
  gitlabs: GitlabsListData[]
}


export default function SetupSuperAdminForm({ data, setData, setIsStageReady, gitlabs }: SetupSuperAdminForm) {
  const [selectedGitlab, setSelectedGitlab] = useState<number>(-1)

  return (
    <>
      <Typography variant="h4" gutterBottom>Set a Super-Admin</Typography>
      <Box>
        <List>
          { gitlabs.map((gitlab, index) => (
            <ListItemButton
              key={gitlab.name}
              selected={selectedGitlab === index}
              onClick={() => setSelectedGitlab(index)}
            >
              <ListItemText
                primary={gitlab.name}
                secondary={gitlab.url}
              />
            </ListItemButton>
          )) }
        </List>
      </Box>
    </>
  )
}
