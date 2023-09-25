import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../App.tsx'
import { AppBar, Box, Container, CssBaseline, IconButton, Menu, MenuItem, Paper, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'


export default function LoggedInLayout() {
  const { state } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleProfileMenuClose() {
    setAnchorEl(null)
  }

  function handleLogoutClick() {
    navigate('/logout')
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{
        backgroundColor: '#E24329',
      }}>
        <Toolbar disableGutters sx={{
          paddingLeft: '30px',
          paddingRight: '30px',
        }}>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            GiLaPi
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{
              padding: 0,
            }}
          >
            <Avatar />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Container>
        <Toolbar sx={{
          marginBottom: '16px',
        }} />
        <Paper>
          <Box component="main">
            <Outlet />
          </Box>
        </Paper>
      </Container>
    </Box>
    )
}
