import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { Home, Login, Loading, Demo } from '@components'
import { AuthContext } from '@contexts'
import { loginWithRememberToken as loginAPI, getMe } from '@api'
import { Layout } from './layout'
import dayjs from 'dayjs'

const RedirectComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { currentUser, setCurrentUser } = useContext(AuthContext)

  useEffect(() => {
    const login = async () => {
      setIsLoading(true)
      if (currentUser === undefined) {
        const me = await getMe()
        if (me) {
          setCurrentUser(me)
        } else {
          const loginRes = await loginAPI()
          if (loginRes.code === 200) {
            const me = await getMe()
            setCurrentUser(me)
          }
        }
      }
      setIsLoading(false)
    }
    login()
  }, [currentUser])

  return (
    <>
      {
        isLoading
        ? <Loading isLoading={isLoading} />
        : currentUser === undefined
        ? <Login />
        : children
      }
    </>
  )
}

const RedirectRoute = ({ path, exact, component }) => {

  return (
    <Route path={path} exact={exact}>
      <RedirectComponent>
        {React.createElement(component)}
      </RedirectComponent>
    </Route>
  )
}

export const Routing = () => {
  return (
    <Router>
      <Layout>
        <Route path="/" exact>
          <Redirect to={`/calendar/week/${dayjs().startOf('day').format('YYYY-MM-DD')}`} />
        </Route>
        <RedirectRoute
          path='/calendar/week/:date'
          exact
          component={Home}
        />
        <RedirectRoute
          path='/demo'
          exact
          component={Demo}
        />
      </Layout>
    </Router>
  )
}
