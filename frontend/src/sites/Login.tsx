import { Box, Button, Container } from '@mui/material'
import { useContext } from 'react'
import { AuthContext } from '../App.tsx'


export default function Login() {
  const { state, dispatch } = useContext(AuthContext)

  const gitlabScope = 'api+read_user+read_api+read_repository+profile+sudo+write_repository'

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <Button variant="contained" href={`http://localhost:8080/oauth/authorize?client_id=${state.clientId}&redirect_uri=${state.redirectURI}&response_type=code&state=STATE&scope=${gitlabScope}&code_challenge=CODE_CHALLENGE&code_challenge_method=S256`}>Login with GitLab</Button>
      </Box>
    </Container>
  )
}
