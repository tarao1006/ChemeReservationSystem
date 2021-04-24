import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AuthProvider } from '@contexts'
import { Header } from './components/Header'

export const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <CssBaseline />
      <Header />
      {children}
    </AuthProvider>
  )
}
