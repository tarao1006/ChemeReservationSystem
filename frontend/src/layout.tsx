import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Header } from './components/Header'

export const Layout = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Header />
      {children}
    </>
  )
}
