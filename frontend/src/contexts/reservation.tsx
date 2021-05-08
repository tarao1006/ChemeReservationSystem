import React, { createContext, useReducer, Dispatch } from "react"
import {
  initialState,
  reducer,
  State,
  ActionType,
} from '../reducer/reservation'

export const ReservationsContext = createContext<State>({
  reservations: [],
  fetchedDateRange: {
    from: '',
    to: '',
  }
})

export const ReservationsDispatchContext = createContext<Dispatch<ActionType>>(null)

export const ReservationProvider = ({ children }) => {
  const [reservations, dispatch] = useReducer(reducer, initialState)

  return (
    <ReservationsContext.Provider value={reservations}>
      <ReservationsDispatchContext.Provider value={dispatch}>
        {children}
      </ReservationsDispatchContext.Provider>
    </ReservationsContext.Provider>
  )
}
