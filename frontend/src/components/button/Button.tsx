import MUIButton, { ButtonProps } from '@mui/material/Button'


export function Button({ children, ...props }: ButtonProps = {}) {
  return (
    <MUIButton { ...props } variant="contained">{ children }</MUIButton>
  )
}
