import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container';
import { AuthProvider } from '@contexts'
import { Header } from './components/Header'
import { Copyright } from './components/Copyright'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 56px)',
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
