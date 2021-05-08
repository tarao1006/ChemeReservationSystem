import { useContext, Dispatch, SetStateAction } from 'react'
import { AuthContext, AuthSetContext } from '@contexts'
import { State } from '../reducer/auth'
import { User } from '@types'
import {
  login as loginAPI,
  loginWithRememberToken as loginWithRememberTokenAPI,
  logout as logoutAPI,
  getMe
} from '@api'

export const useAuth = (): {
  currentUser: State
  setCurrentUser: Dispatch<SetStateAction<User>>
  authLogin: (userId: string, password: string, rememberMe: boolean) => Promise<boolean>
  authLoginWithRememberToken: () => Promise<boolean>
  authLogout: () => Promise<void>
} => {
  const currentUser = useContext(AuthContext)
  const setCurrentUser = useContext(AuthSetContext)

  const authLogin = async (
    userId: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    const res = await loginAPI(userId, password, rememberMe)
    if (res.code === 200) {
      const me = await getMe()
      setCurrentUser(me)
      return true
    } else {
      return false
    }
  }

  const authLoginWithRememberToken = async (): Promise<boolean> => {
    const me = await getMe()
    if (me) {
      setCurrentUser(me)
      return true
    } else {
      const loginRes = await loginWithRememberTokenAPI()
      if (loginRes.code === 200) {
        const me = await getMe()
        setCurrentUser(me)
        return true
      }
    }
    return false
  }

  const authLogout = async () => {
    await logoutAPI()
    setCurrentUser(undefined)
  }

  return {
    currentUser,
    setCurrentUser,
    authLogin,
    authLoginWithRememberToken,
    authLogout
  }
}
