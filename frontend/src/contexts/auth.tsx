import React, { createContext, useState } from "react"
import { User } from '@types'

type State = User | undefined

interface IAuthContext {
  currentUser: State
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: undefined,
  setCurrentUser: () => {}
})

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<State>(undefined)

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}
