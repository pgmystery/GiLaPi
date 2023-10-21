import { AppBar, Toolbar, Box } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'
import { BoxProps } from '@mui/material/Box/Box'


export interface GilapiToolbarProps {
  onLogoClick?: React.MouseEventHandler<HTMLButtonElement>
  addToolbarSpace?: boolean
  children?: React.ReactNode
}


export function GilapiToolbarSpace(props: BoxProps) {
  return <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }} {...props} />
}


export default function GilapiToolbar({ onLogoClick, addToolbarSpace, children }: GilapiToolbarProps) {
  return (
    <>
      <AppBar component="nav" sx={{
        backgroundColor: '#E24329',
      }}>
        <Toolbar disableGutters sx={{
          paddingLeft: '30px',
          paddingRight: '30px',
        }}>
          <Button
            variant="text"
            onClick={onLogoClick}
            sx={{
              color: 'white',
              textTransform: 'none',
            }}
          >
            <Typography variant="h4">
              GiLaPi
            </Typography>
          </Button>
          { children }
        </Toolbar>
      </AppBar>
      { addToolbarSpace && <Toolbar sx={{marginBottom: '16px'}} /> }
    </>
  )
}
