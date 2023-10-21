import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { Button, DialogContentText } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import { ModalProps } from '@mui/material/Modal'

export interface InfoDialogProps {
  title: string
  message: string
  buttonText?: string
  onClose: ()=>void
  open: ModalProps['open']
}

export default function InfoDialog({ title, message, buttonText, open, onClose }: InfoDialogProps) {
  function getButtonText() {
    return buttonText
      ? buttonText
      : "Close"
  }

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>{ title }</DialogTitle>
      <DialogContent>
        <DialogContentText>{ message }</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>{ getButtonText() }</Button>
      </DialogActions>
    </Dialog>
  )
}
