import React, { createContext, useState, Dispatch, SetStateAction } from "react"
import { User } from '@types'

export const UserContext = createContext<User[]>([])

export const UserSetContext = createContext<Dispatch<SetStateAction<User[]>>>(() => {})

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])

  return (
    <UserContext.Provider value={users}>
      <UserSetContext.Provider value={setUsers}>
        {children}
      </UserSetContext.Provider>
    </UserContext.Provider>
  )
}
