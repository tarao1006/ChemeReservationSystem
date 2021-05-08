import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { Loading } from '@components'
import { Login } from '@pages'
import {
  AuthContext,
  FacilityContext,
  PlanContext,
  UserContext,
} from '@contexts'
import {
  loginWithRememberToken as loginAPI,
  getMe,
  getAllFacilities,
  getAllUsers,
  getAllPlans,
} from '@api'
import { useAuth } from '@hooks'

const RedirectComponent = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth()
  const { setFacilities, setChecked } = useContext(FacilityContext)
  const { setUsers } = useContext(UserContext)
  const { setPlans } = useContext(PlanContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getResources = async () => {
    const allFacilities = await getAllFacilities()
    setFacilities(allFacilities)
    setChecked(allFacilities.map(f => f.id))

    const u = await getAllUsers()
    setUsers(u)

    const p = await getAllPlans()
    setPlans(p)
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
      <RedirectComponent>
        {component}
      </RedirectComponent>
    </Route>
  )
}
