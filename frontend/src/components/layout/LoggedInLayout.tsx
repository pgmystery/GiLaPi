import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../App.tsx'
import { AppBar, Box, Container, CssBaseline, IconButton, Link, Menu, MenuItem, Paper, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'


export default function LoggedInLayout() {
  const { state } = useContext(AuthContext)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user } = state

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

  async function handleProfileInfoClick() {
    const { user } = state

    if (user) {
      const { access_token: accessToken } = user

      const parameters = `access_token=${accessToken}`
      const response = await fetch(`http://192.168.1.2:8080/api/v4/user?${parameters}`, {
      // const response = await fetch(`http://192.168.1.2:8080/oauth/token/info?${parameters}`, {
      // const response = await fetch(`http://192.168.1.2:8080/oauth/userinfo?${parameters}`, {
      // const response = await fetch(`http://192.168.1.2:8080/oauth/userinfo`, {
        // method: 'POST',
        method: 'GET',
        // withCredentials: true,
        // credentials: 'include',
        // signal: abortController.signal,
        // mode: 'no-cors',
        // headers: {
        //   Authorization: `${tokenType} ${accessToken}`,
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json'
        // }
      })
      const result = await response.text()
      // const result = await response.json()

      console.log(result)
    }

    handleProfileMenuClose()
  }

  if (user) {
    const { name, username, avatar_url: avatarURL } = user

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
              <Avatar alt={username} src={avatarURL} />
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
              <Link href={`http://192.168.1.2:8080/${username}`} underline="none" color="inherit" target="_blank" rel="noopener">
                <MenuItem>
                  <ListItemText
                    primary={ name }
                    secondary={ `@${username}` }
                  />
                </MenuItem>
              </Link>
              <Divider />
              <MenuItem onClick={handleProfileInfoClick}>Profile</MenuItem>
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
  else {
    return <Navigate to="/login" replace />
  }
}
