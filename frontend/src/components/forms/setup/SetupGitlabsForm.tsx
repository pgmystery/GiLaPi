import Typography from '@mui/material/Typography'
import { Box, IconButton, ListItem, Stack, TextField } from '@mui/material'
import List from '@mui/material/List'
import { FormEvent, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'


interface SetupGitlabsFormProps {
  data: GitlabsListData[]
  setData: React.Dispatch<GitlabsListData[]>
  setIsStageReady: React.Dispatch<React.SetStateAction<boolean>>
}

export interface GitlabsListData {
  name: string
  url: string
}


export default function SetupGitlabsForm({ data, setData, setIsStageReady }: SetupGitlabsFormProps) {
  const [nameFieldText, setNameFieldText] = useState<string>('')
  const [urlFieldText, setUrlFieldText] = useState<string>('')

  useEffect(() => {
    setIsStageReady(data.length > 0)
  }, [data, setIsStageReady])

  function addItemToList(event: FormEvent) {
    event.preventDefault()

    if (nameFieldText.length === 0 || urlFieldText.length === 0) return

    const isAlreadyInList = data.some(gitlab => {
      const { name, url } = gitlab

      return name === nameFieldText || url === urlFieldText
    })

    if (isAlreadyInList) return

    setData([
      ...data,
      {
        name: nameFieldText,
        url: urlFieldText,
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

    setData([
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
          <TextField label="Name" variant="filled" required autoFocus value={nameFieldText} onChange={e => setNameFieldText(e.target.value)} />
          <TextField label="URL" variant="filled" type="url" required value={urlFieldText} onChange={e => setUrlFieldText(e.target.value)} />
          <Button variant="contained" endIcon={<AddIcon />} type="submit" disabled={!(nameFieldText.length > 0 && urlFieldText.length > 0)}>Add</Button>
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
