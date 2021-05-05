import React, { createContext, useState } from "react"
import { User } from '@types'

interface IUserContext {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export const UserContext = createContext<IUserContext>({
  users: [],
  setUsers: () => {}
})

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      {children}
    </UserContext.Provider>
  )
}
