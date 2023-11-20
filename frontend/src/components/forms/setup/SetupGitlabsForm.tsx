import Typography from '@mui/material/Typography'
import { Box, IconButton, ListItem, Stack, TextField } from '@mui/material'
import List from '@mui/material/List'
import { FormEvent, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import { SetupStageFormProps } from '../../../sites/Setup.tsx'


export interface GitlabsListData {
  name: string
  url: string
  gilapiUrl: string
}


export default function SetupGitlabsForm({ data, onSubmit, onReadyChanged }: SetupStageFormProps<GitlabsListData[]>) {
  const [nameFieldText, setNameFieldText] = useState<string>('')
  const [urlFieldText, setUrlFieldText] = useState<string>('')
  const [gilapiUrlFieldText, setGilapiUrlFieldText] = useState<string>(window.location.origin)

  useEffect(() => {
    onReadyChanged(data.length > 0)
  }, [data, onReadyChanged])

  function addItemToList(event: FormEvent) {
    event.preventDefault()

    if (nameFieldText.length === 0 || urlFieldText.length === 0) return

    const isAlreadyInList = data.some(gitlab => {
      const { name, url } = gitlab

      return name === nameFieldText || url === urlFieldText
    })

    if (isAlreadyInList) return

    onSubmit([
      ...data,
      {
        name: nameFieldText,
        url: urlFieldText,
        gilapiUrl: gilapiUrlFieldText,
      }
    ])
    setNameFieldText('')
    setUrlFieldText('')
  }

  function deleteItemFromList(item: GitlabsListData) {
    const itemToDeleteIndex = data.findIndex(gitlab => {
      const { name, url } = gitlab

      return name === item.name || url === item.url
    })

    onSubmit([
      ...data.slice(0, itemToDeleteIndex),
      ...data.slice(itemToDeleteIndex + 1)
    ])
  }

  function getGitlabsItems() {
    return data.map(gitlab => {
      const { name, url } = gitlab

      return (
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => deleteItemFromList(gitlab)}>
              <DeleteIcon color="error" />
            </IconButton>
          }
          key={name}
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
      <Typography variant="h4" gutterBottom>Add Gitlab environments</Typography>
      <Box>
        <Stack component="form" spacing={2} onSubmit={addItemToList}>
          <TextField label="Name" variant="outlined" required autoFocus value={nameFieldText} onChange={e => setNameFieldText(e.target.value)} />
          <TextField label="URL" variant="outlined" type="url" required value={urlFieldText} onChange={e => setUrlFieldText(e.target.value)} />
          <TextField label="GiLaPi-URL for OAuth redirect" variant="outlined" type="url" required value={gilapiUrlFieldText} onChange={e => setGilapiUrlFieldText(e.target.value)} />
          <Button variant="contained" endIcon={<AddIcon />} type="submit" disabled={!(nameFieldText.length > 0 && urlFieldText.length > 0 && gilapiUrlFieldText.length > 0)}>Add GitLab</Button>
        </Stack>
      </Box>
      <Box>
        <List>
          { getGitlabsItems() }
        </List>
      </Box>
    </>
  )
}
