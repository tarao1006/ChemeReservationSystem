import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import { AuthProvider, ReservationProvider } from '@contexts'
import { Header } from '@components'
import { headerHeight } from '@config'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${headerHeight})`,
  },
}));

export const Layout = ({ children }) => {
  const classes = useStyles()

  return (
    <AuthProvider>
    <ReservationProvider>
      <CssBaseline />
      <Header />
      <div className={classes.root}>
        {children}
      </div>
    </ReservationProvider>
    </AuthProvider>
  )
}
