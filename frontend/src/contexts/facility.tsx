import React, { createContext, useReducer, Dispatch } from "react"
import {
  initialState,
  reducer,
  State,
  ActionType,
} from '../reducer/facility'

export const FacilitiesContext = createContext<State>({
  facilities: [],
  checked: [],
})

export const FacilitiesDispatchContext = createContext<Dispatch<ActionType>>(null)


export const FacilityProvider = ({ children }) => {
  const [facilities, dispatch] = useReducer(reducer, initialState)

  return (
    <FacilitiesContext.Provider value={facilities}>
      <FacilitiesDispatchContext.Provider value={dispatch}>
        {children}
      </FacilitiesDispatchContext.Provider>
    </FacilitiesContext.Provider>
  )
}
