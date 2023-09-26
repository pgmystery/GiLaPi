import { Backdrop, Box, CircularProgress, SxProps, Theme } from '@mui/material'

interface BackdropInsideProps {
  open: boolean
  sx?: SxProps<Theme>
  children?: React.ReactNode
}

export default function BackdropInside({ open, sx, children }: BackdropInsideProps) {
  return (
    <Box sx={{
      position: 'relative',
    }}>
      <Backdrop sx={{
        position: 'absolute',
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ...sx
      }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      { children }
    </Box>
  )
}
