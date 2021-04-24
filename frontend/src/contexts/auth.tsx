import React, { createContext, useState } from "react"
import { User, getMe, login as loginAPI, logout as logoutAPI } from '@api'

type user = User | undefined

interface IAuthContext {
  token: string
  currentUser: user
  login(userId: string, password: string, remember: boolean): void
  logout(): void
}

export const AuthContext = createContext<IAuthContext>({
  token: "",
  currentUser: undefined,
  login: (userId: string, password: string, remember: boolean) => {},
  logout: () => {}
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<user>(undefined)

  const login = async (userId: string, password: string, remember: boolean): Promise<void> => {
    const jwt = await loginAPI(userId, password, remember)
    const t = jwt.token
    const u = await getMe(t)
    setToken(t)
    setCurrentUser(u)
  }

  const logout = async (): Promise<void> => {
    await logoutAPI()
    setToken('')
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{token, currentUser, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}
