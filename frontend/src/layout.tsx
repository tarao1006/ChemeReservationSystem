import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { AuthProvider } from '@contexts'
import { Header } from '@components'
import { headerHeight } from '@config'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${headerHeight})`,
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    bottom: 0,
  },
}));

export const Layout = ({ children }) => {
  const classes = useStyles()

  return (
    <AuthProvider>
      <CssBaseline />
      <Header />
      <div className={classes.root}>
        <Container component="main">
          {children}
        </Container>
      </div>
    </AuthProvider>
  )
}
