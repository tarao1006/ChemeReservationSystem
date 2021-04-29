import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Home, Login } from '@components'
import { AuthContext } from '@contexts'
import { loginWithRememberToken as loginAPI, getMe } from '@api'
import { Layout } from './layout'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      color: '#444',
    },
  }),
);

const RedirectComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const classes = useStyles()

  useEffect(() => {
    const login = async () => {
      setIsLoading(true)
      if (currentUser == undefined) {
        const res = await getMe()
        if (res.status == 200) {
          setCurrentUser(res.data)
        } else {
          const loginRes = await loginAPI()
          if (loginRes.code == 200) {
            const res = await getMe()
            setCurrentUser(res.data)
          }
        }
      }
      setIsLoading(false)
    }
    login()
  }, [currentUser])

  return (isLoading
    ? <Backdrop classes={{ root: classes.root }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
