import Typography from '@mui/material/Typography'
import { Box, FormGroup, IconButton, ListItem, TextField } from '@mui/material'
import List from '@mui/material/List'
import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'


interface GitlabsListData {
  name: string
  url: string
}


export default function SetupGitlabsForm() {
  const [gitlabs, setGitlabs] = useState<GitlabsListData[]>([])
  const [nameFieldText, setNameFieldText] = useState<string>('')
  const [urlFieldText, setUrlFieldText] = useState<string>('')

  function addItemToList() {
    const isAlreadyInList = gitlabs.some(gitlab => {
      const { name, url } = gitlab

      return name === nameFieldText || url === urlFieldText
    })

    if (isAlreadyInList) return

    setGitlabs([
      ...gitlabs,
      {
        name: nameFieldText,
        url: urlFieldText,
      }
    ])
  }

  function deleteItemFromList(item: GitlabsListData) {
    const itemToDeleteIndex = gitlabs.findIndex(gitlab => {
      const { name, url } = gitlab

      return name === item.name || url === item.url
    })

    setGitlabs([
      ...gitlabs.slice(0, itemToDeleteIndex),
      ...gitlabs.slice(itemToDeleteIndex + 1)
    ])
  }

  function getGitlabsItems() {
    return gitlabs.map(gitlab => {
      const { name, url } = gitlab

      return (
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteItemFromList(gitlab)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={name}
            secondary={url}
          />
        </ListItem>
      )
    })
  }

  return (
    <>
      <Typography>Add Gitlabs environments</Typography>
      <Box>
        <FormGroup>
          <TextField label="Name" variant="filled" value={nameFieldText} onChange={e => setNameFieldText(e.target.value)} />
          <TextField label="URL" variant="filled" value={urlFieldText} onChange={e => setUrlFieldText(e.target.value)} />
          <Button variant="contained" endIcon={<AddIcon />} onClick={addItemToList}>Add</Button>
        </FormGroup>
      </Box>
      <Box>
        <List>
          { getGitlabsItems() }
        </List>
      </Box>
    </>
  )
}
