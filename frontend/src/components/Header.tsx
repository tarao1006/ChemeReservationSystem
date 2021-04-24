import React, { useContext } from 'react'
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
import { AuthContext } from '@contexts'
import { testUserID, testUserPassword } from '@api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    popover: {
      marginTop: theme.spacing(8),
    },
  }),
);

export const Header = () => {
  const { currentUser, login, logout} = useContext(AuthContext)

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    handleClose()
    login(testUserID, testUserPassword, true)
  }

  const handleLogout = () => {
    handleClose()
    logout()
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
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" noWrap>
            施設予約
          </Typography>
          <div className={classes.grow} />
          {currentUser === undefined
          ? (<Button variant="outlined" size="small" onClick={handleLogin}>ログイン</Button>)
          : (<>
              <Button
                onClick={handleOpen}
                color="inherit"
                endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                <AccountCircle />
              </Button>
              {renderMenu}
            </>)
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}
