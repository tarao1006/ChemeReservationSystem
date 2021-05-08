import React, { createContext, useReducer, Dispatch } from "react"
import {
  initialState,
  reducer,
  State,
  ActionType,
} from '../reducer/user'

export const UsersContext = createContext<State | undefined>(undefined)
export const UsersDispatchContext = createContext<Dispatch<ActionType>>(null)

export const UserProvider = ({ children }) => {
  const [users, dispatch] = useReducer(reducer, initialState)

  return (
    <UsersContext.Provider value={users}>
      <UsersDispatchContext.Provider value={dispatch}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersContext.Provider>
  )
}
