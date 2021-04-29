import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { Layout } from './layout'
import { AuthContext } from '@contexts'
import { loginWithRememberToken as loginAPI, getMe } from '@api'

const RedirectComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { currentUser, setToken, setCurrentUser } = useContext(AuthContext)

  useEffect(() => {
    const login = async () => {
      setIsLoading(true)
      if (currentUser == undefined) {
        if (localStorage.getItem('remember-me') == 'yes') {
          const token = await loginAPI()
          if (token != "") {
            const u = await getMe(token)
            setToken(token)
            setCurrentUser(u)
          }
        }
      }
      setIsLoading(false)
    }
    login()
  }, [currentUser])

  return (isLoading
    ? <>hoge</>
    : currentUser === undefined
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
