import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import { AuthProvider, ReservationProvider } from '@contexts'
import { Header } from '@components'
import { headerHeight } from '@config'

const useStyles = makeStyles(() => ({
  root:{
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
  },
  main: {
    flex: '1 1 auto',
    overflow: 'hidden',
    height: '100%',
  },
  allWrap: {
    position: 'relative',
    height: '100%',
  },
  wrap: {
    position: 'relative',
    width: '100%',
    height: `calc(100vh - ${headerHeight})`,
    display: 'flex',
    boxSizing: 'border-box',
  },
  mainPanel: {
    flex: '1 1 auto',
    overflow: 'hidden',
    position: 'relative',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const Layout = ({ children }) => {
  const classes = useStyles()

  return (
    <AuthProvider>
    <ReservationProvider>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.main}>
          <div className={classes.allWrap}>
            <Header />
            <div className={classes.wrap}>
              <div className={classes.mainPanel}>
                {children}
              </div>
              <div className={classes.rightPanel}>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReservationProvider>
    </AuthProvider>
  )
}
