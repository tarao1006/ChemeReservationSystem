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
  wrap: {
    flex: '1 1 auto',
    overflow: 'hidden',
    height: '100%',
  },
  container: {
    position: 'relative',
    height: '100%',
  },
  main: {
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
}));

export const Layout = ({ children }) => {
  const classes = useStyles()

  return (
    <AuthProvider>
    <ReservationProvider>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.wrap}>
          <div className={classes.container}>
            <Header />
            <div className={classes.main}>
              <div className={classes.mainPanel}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReservationProvider>
    </AuthProvider>
  )
}
