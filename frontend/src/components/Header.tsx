import React, { useContext } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Menu from '@material-ui/core/Menu'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import EventNoteIcon from '@material-ui/icons/EventNote'
import { AuthContext } from '@contexts'
import { logout } from '@api'
import { headerHeight } from '@config'
import { IconButton } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginRight: theme.spacing(3.0),
    },
    toolbar: {
      minHeight: `${headerHeight}`,
    },
    grow: {
      flexGrow: 1,
    },
    popover: {
      marginTop: theme.spacing(8),
    },
  }),
)

export const Header = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const location = useLocation()

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const isOpen = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('remember-me')
    setCurrentUser(undefined)
    handleClose()
  }

  const renderMenu = (
    <Menu
      className={classes.popover}
      anchorEl={anchorEl}
      open={isOpen}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <MenuItem onClick={handleClose}>マイページ</MenuItem>
      <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
    </Menu>
  )

  const LoginButton = () => {
    return (
      <Button
        variant="outlined"
        component={RouterLink}
        to="/login"
      >
        ログイン
      </Button>
    )
  }

  const AccountButton = () => {
    return (
      <Button
        onClick={handleOpen}
        color="inherit"
        endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        <AccountCircle />
      </Button>
    )
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" noWrap className={classes.title}>
            施設予約
          </Typography>
          <IconButton color="inherit">
            <EventNoteIcon />
          </IconButton>
          <div className={classes.grow} />
          {currentUser !== undefined && (
            <>
              <Button
                onClick={handleOpen}
                color="inherit"
                endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                <AccountCircle />
              </Button>
              {renderMenu}
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
