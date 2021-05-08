import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { Loading } from '@components'
import { Login } from '@pages'
import { Layout } from './Layout'
import {
  loginWithRememberToken as loginAPI,
  getMe,
  getAllFacilities,
} from '@api'
import { useAuth, useUsers, usePlans, useFacilities } from '@hooks'

const RedirectComponent = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth()
  const { initFacilities } = useFacilities()
  const { initUsers } = useUsers()
  const { initPlans } = usePlans()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getResources = async () => {
    const allFacilities = await getAllFacilities()
    initFacilities()
    initUsers()
    initPlans()
  }

  useEffect(() => {
    const login = async () => {
      setIsLoading(true)
      if (currentUser === undefined) {
        const me = await getMe()
        if (me) {
          setCurrentUser(me)
          getResources()
        } else {
          const loginRes = await loginAPI()
          if (loginRes.code === 200) {
            const me = await getMe()
            setCurrentUser(me)
            getResources()
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
       <Loading />
      ) : currentUser === undefined ? (
        <Login />
      ) : children}
    </>
  )
}

export const RedirectRoute = ({
  path,
  exact,
  component
}: {
  path: string,
  exact: boolean
  component: JSX.Element
}) => {

  return (
    <Route path={path} exact={exact}>
      <Layout>
        <RedirectComponent>
          {component}
        </RedirectComponent>
     </Layout>
    </Route>
  )
}
