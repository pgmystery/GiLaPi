import { ButtonProps } from '@mui/material/Button'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import GitlabLogo from '../../resources/GitlabLogo.tsx'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../App.tsx'
import { LoginState } from '../../store/reducer.tsx'


export interface GitlabLoginButtonProps extends ButtonProps {
  gitlabOAuthURL: string
  openPopup?: GitlabLoginButtonPopupOptions
}

export interface GitlabLoginButtonPopupOptions {
  onLogin: (state: boolean)=>void
  window?: GitlabLoginButtonPopupWindowOptions
  showLoading?: boolean
}

export interface GitlabLoginButtonPopupWindowOptions {
  width?: number,
  height?: number,
  left?: number,
  top?: number,
  title?: string
}

const defaultLoginPopupOptions: GitlabLoginButtonPopupWindowOptions = {
  width: 520,
  height: 560,
  left: window.screenX + (window.outerWidth - 520) / 2,
  top: window.screenY + (window.outerHeight - 560) / 2,
  title: 'GiLaPi GitLab OAuth login',
}

type PopupWindowState = null | 'open' | 'closed'


export default function GitlabLoginButton({ gitlabOAuthURL, openPopup, onClick, children, ...props }: GitlabLoginButtonProps) {
  const { state: authState, dispatch } = useContext(AuthContext)
  const [loginPopupWindow, setLoginPopupWindow] = useState<Window | null>(null)
  const [loginPopupWindowState, setLoginPopupWindowState] = useState<PopupWindowState>(null)

  useEffect(() => {
    if (openPopup && loginPopupWindow && loginPopupWindowState === 'closed') {
      const { onLogin } = openPopup
      const { isLoggedIn } = authState

      onLogin(isLoggedIn)
      setLoginPopupWindowState(null)
    }
  }, [openPopup, authState, loginPopupWindow, loginPopupWindowState])

  useEffect(() => {
      if (!loginPopupWindow) return

      const timer = setInterval(() => {
        if (loginPopupWindow.window?.closed && loginPopupWindowState === 'open') {
          timer && clearInterval(timer)

          dispatch({
            type: LoginState.RELOAD,
          })
          setLoginPopupWindowState('closed')

          return
        }
      }, 500)
    }, [dispatch, loginPopupWindow, loginPopupWindowState])

  function handleClick(event:  React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const {
      top,
      left,
      width,
      title,
      height,
    } = {...defaultLoginPopupOptions, ...openPopup?.window}
    const popup = window.open(gitlabOAuthURL, title, `width=${width},height=${height},left=${left},top=${top}`)
    setLoginPopupWindow(popup)
    setLoginPopupWindowState('open')

    if (onClick) {
      onClick(event)
    }
  }

  function ButtonComponent({ ...subProps }: ButtonProps) {
    return (
      <Button
        variant="contained"
        startIcon={<GitlabLogo />}
        size="large"
        { ...subProps }
        { ...props }
      >
        {
          children
          ? children
          : 'Login with GitLab'
        }
      </Button>
    )
  }

  return openPopup
    ? <>
        <ButtonComponent onClick={ handleClick } disabled={openPopup.showLoading === true && loginPopupWindowState !== null}/>
        <Backdrop
         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={openPopup.showLoading === true && loginPopupWindowState !== null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </>
    : <ButtonComponent href={ gitlabOAuthURL }/>
}
