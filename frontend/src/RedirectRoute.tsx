import React, { createElement, useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { Login, Loading } from '@components'
import { AuthContext } from '@contexts'
import { loginWithRememberToken as loginAPI, getMe } from '@api'

interface LeftPanelIsOpenProps {
  isLeftPanelOpen: boolean
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RedirectComponent = ({ children }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

export const RedirectRoute = ({
  path,
  exact,
  component,
  isLeftPanelOpen,
  setIsLeftPanelOpen
}: {
  path: string,
  exact: boolean
  component: React.FunctionComponent<LeftPanelIsOpenProps>
  isLeftPanelOpen: boolean
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

  return (
    <Route path={path} exact={exact}>
      <RedirectComponent>
        {createElement<LeftPanelIsOpenProps>(
          component,
          {
            isLeftPanelOpen,
            setIsLeftPanelOpen
          }
        )}
      </RedirectComponent>
    </Route>
  )
}
