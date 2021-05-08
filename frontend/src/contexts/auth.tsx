import React, { createContext, useState, Dispatch, SetStateAction } from "react"
import { User } from '@types'
import { State } from '../reducer/auth'

export const AuthContext = createContext<State | undefined>(undefined)
export const AuthSetContext = createContext<Dispatch<SetStateAction<User>>>(null)

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
