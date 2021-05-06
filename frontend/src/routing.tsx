import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { Login, Loading, WeeklyCalendar } from '@components'
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
      {isLoading ? (
       <Loading isLoading={isLoading} />
      ) : currentUser === undefined ? (
        <Login />
      ) : children}
    </>
  )
}

const RedirectRoute = ({
  path,
  exact,
  component,
  isLeftPanelOpen,
  setIsLeftPanelOpen
}: {
  path: string,
  exact: boolean
  component: React.FunctionComponent<{ isLeftPanelOpen: boolean, setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>> }>
  isLeftPanelOpen: boolean
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

  return (
    <Route path={path} exact={exact}>
      <RedirectComponent>
        {React.createElement<{ isLeftPanelOpen: boolean, setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>> }>(component, {isLeftPanelOpen: isLeftPanelOpen, setIsLeftPanelOpen: setIsLeftPanelOpen})}
      </RedirectComponent>
    </Route>
  )
}

export const Routing = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true)

  return (
    <Router>
      <Layout
        isLeftPanelOpen={isLeftPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
      >
        <Route path="/" exact>
          <Redirect to={`/calendar/month/${dayjs().startOf('day').format('YYYY-MM-DD')}`} />
        </Route>
        <RedirectRoute
          path='/calendar/day/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
        <RedirectRoute
          path='/calendar/week/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
        <RedirectRoute
          path='/calendar/month/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
      </Layout>
    </Router>
  )
}
