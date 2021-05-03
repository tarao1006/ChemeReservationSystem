import React, { useContext, useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
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
    appIcon: {
      marginRight: theme.spacing(3.0),
      marginLeft: theme.spacing(3.0),
    },
    toolbar: {
      [theme.breakpoints.up('sm')]: {
        minHeight: `${headerHeight}`,
      },
    },
    grow: {
      flexGrow: 1,
    },
    dialog: {
      zIndex: theme.zIndex.appBar,
      position: 'absolute',
      top: `${headerHeight}`,
      right: theme.spacing(1.0),
      display: 'flex',
      flexDirection: 'column',
    },
    dialogPaper: {
      marginTop: theme.spacing(0.5),
      width: theme.spacing(16),
      height: theme.spacing(12),
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      border: '#dadce0 1px solid',
    },
    dialogList: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      '& * >': {
        with: '100%',
      }
    }
  }),
)

export const Header = () => {
  const classes = useStyles()
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const handleClick = () => {
    setIsDialogOpen(prev => !prev)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setCurrentUser(undefined)
    handleClose()
  }

  const renderDialog = (
    <div className={classes.dialog}>
      <Paper elevation={5} className={classes.dialogPaper}>
        <List className={classes.dialogList}>
          <ListItem onClick={handleClose} button>マイページ</ListItem>
          <ListItem onClick={handleLogout} button>ログアウト</ListItem>
        </List>
      </Paper>
    </div>
  )

  return (
    <AppBar color="primary" position="static" elevation={0}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" noWrap>
          施設予約
        </Typography>
        <IconButton className={classes.appIcon} color="inherit">
          <EventNoteIcon />
        </IconButton>
        <div className={classes.grow} />
        {currentUser !== undefined && (
          <ClickAwayListener onClickAway={handleClose}>
            <div>
            <Button
              onClick={handleClick}
              color="inherit"
              endIcon={isDialogOpen ? <ExpandLessIcon />: <ExpandMoreIcon />}
            >
              <AccountCircle />
            </Button>
            <Fade in={isDialogOpen} timeout={200}>
              {renderDialog}
            </Fade>
            </div>
          </ClickAwayListener>
        )}
      </Toolbar>
    </AppBar>
  );
}
