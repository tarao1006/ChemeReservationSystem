import React, { createContext, useState, Dispatch, SetStateAction } from "react"
import { User } from '@types'

export type State = User | undefined

export const AuthContext = createContext<State>(undefined)

export const AuthSetContext = createContext<Dispatch<SetStateAction<User>>>(() => {})

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<State>(undefined)

  return (
    <AuthContext.Provider value={currentUser}>
      <AuthSetContext.Provider value={setCurrentUser}>
        {children}
      </AuthSetContext.Provider>
    </AuthContext.Provider>
  )
}
