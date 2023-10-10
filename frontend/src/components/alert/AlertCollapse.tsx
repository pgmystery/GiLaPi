import { Alert, AlertTitle, Collapse } from '@mui/material'
import { AlertProps } from '@mui/material/Alert/Alert'


interface AlertCollapseProps extends AlertProps {
  open: boolean
  title?: string
}

export default function AlertCollapse({ open, title, children, ...props }: AlertCollapseProps) {
  return (
    <Collapse in={open}>
      <Alert {...props}>
        <AlertTitle>{ title }</AlertTitle>
        { children }
      </Alert>
    </Collapse>
  )
}
