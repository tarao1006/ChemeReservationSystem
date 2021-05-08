import React from 'react'
import { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { Loading } from '@components'
import { Login } from '@pages'
import { Layout } from './Layout'
import { useAuth, useUsers, usePlans, useFacilities } from '@hooks'

const RedirectComponent = ({ children }) => {
  const { currentUser, authLoginWithRememberToken } = useAuth()
  const { initFacilities } = useFacilities()
  const { initUsers } = useUsers()
  const { initPlans } = usePlans()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getResources = async () => {
    initFacilities()
    initUsers()
    initPlans()
  }

  useEffect(() => {
    const login = async () => {
      setIsLoading(true)
      if (currentUser === undefined) {
        const res = await authLoginWithRememberToken()
        if (res) {
          getResources()
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
