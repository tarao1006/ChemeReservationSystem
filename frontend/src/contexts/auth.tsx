import React, { createContext, useState } from "react"
import { User } from '@api'

type user = User | undefined

interface IAuthContext {
  token: string
  currentUser: user
  setToken: React.Dispatch<React.SetStateAction<string>>
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>
}

export const AuthContext = createContext<IAuthContext>({
  token: "",
  currentUser: undefined,
  setToken: () => {},
  setCurrentUser: () => {}
})

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<user>(undefined)

  return (
    <AuthContext.Provider value={{ token, currentUser, setToken, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
