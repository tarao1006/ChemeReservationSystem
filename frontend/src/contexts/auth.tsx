import React, { createContext, useState } from "react"
import { User } from '@api'

type user = User | undefined

interface IAuthContext {
  currentUser: user
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: undefined,
  setCurrentUser: () => {}
})

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<user>(undefined)

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
