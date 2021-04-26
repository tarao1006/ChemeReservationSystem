import React, { useContext } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Layout } from './layout'
import { AuthContext } from '@contexts'

const RedirectComponent = ({ children }) => {
  const { currentUser } = useContext(AuthContext)

  return (currentUser === undefined
    ? <Login />
    : <>{children}</>
  )
}

export const Routing = () => {
  return (
    <Router>
      <Layout>
        <Route path='/' exact>
          <RedirectComponent>
            <Home />
          </RedirectComponent>
        </Route>
        <Route path='/home' exact>
          <RedirectComponent>
            <Home />
          </RedirectComponent>
        </Route>
      </Layout>
    </Router>
  )
}
