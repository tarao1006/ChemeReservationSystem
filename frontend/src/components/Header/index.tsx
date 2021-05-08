import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import MenuIcon from '@material-ui/icons/Menu'
import { useAuth } from '@hooks'
import { headerHeight } from '@config'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginRight: theme.spacing(3.0),
    },
    menuIcon: {
      marginRight: theme.spacing(1.0),
    },
    appIcon: {
      marginRight: theme.spacing(3.0),
      marginLeft: theme.spacing(3.0),
    },
    toolbar: {
      [theme.breakpoints.up('sm')]: {
        minHeight: `${headerHeight}px`,
      },
    },
    grow: {
      flexGrow: 1,
    },
    dialog: {
      zIndex: theme.zIndex.appBar,
      position: 'absolute',
      top: `${headerHeight}px`,
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
    },
    buttons: {
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      marginLeft: theme.spacing(2.0),
    },
    button: {
      flex: 'none',
      margin: theme.spacing(1.0),
    },
  }),
)

export const Header = ({ onClick }: { onClick: () => void }) => {
  const classes = useStyles()
  const { currentUser, authLogout } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const history = useHistory()
  const location = useLocation()

  const handleClick = () => {
    setIsDialogOpen(prev => !prev)
  }

  const handleSideMenuIconClick = () => {
    onClick()
  }

  const handleClose = () => {
    setIsDialogOpen(false)
  }

  const handleLogout = async () => {
    authLogout()
    handleClose()
  }

  const handleGoBackToday = () => {
    history.push(`/calendar/week/${dayjs().format('YYYY-MM-DD')}`)
  }

  const handleForwardDay = () => {
    const elms = location.pathname.split('/')
    const currentDate = dayjs(elms[elms.length - 1])
    history.push(`/calendar/week/${currentDate.add(7, 'day').format('YYYY-MM-DD')}`)
  }

  const handleBackDay = () => {
    const elms = location.pathname.split('/')
    const currentDate = dayjs(elms[elms.length - 1])
    history.push(`/calendar/week/${currentDate.add(7, 'day').format('YYYY-MM-DD')}`)
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
        {currentUser !== undefined && (
          <IconButton onClick={handleSideMenuIconClick} className={classes.menuIcon} color="inherit">
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap>
          施設予約
        </Typography>
        {currentUser !== undefined && (
          <div className={classes.buttons}>
            <Button onClick={handleGoBackToday} variant="outlined" color="inherit">
              今日
            </Button>
            <IconButton onClick={handleBackDay} size="medium" className={classes.button} color="inherit">
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleForwardDay} size="medium" className={classes.button} color="inherit">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </div>
        )}
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
