import React, { createContext, useReducer, useState, Dispatch } from "react"
import { DateRange } from '@types'
import {
  initialState,
  reducer,
  State,
  ActionType,
} from '../reducer/reservation'

interface IReservationContext {
  reservations: State
  dispatch: Dispatch<ActionType>
  fetchedDateRange: DateRange
  setFetchedDateRange: React.Dispatch<React.SetStateAction<DateRange>>
}

export const ReservationContext = createContext<IReservationContext>({
  reservations: [],
  dispatch: () => {},
  fetchedDateRange: { from: "", to: "" },
  setFetchedDateRange: () => {}
})

export const ReservationProvider = ({ children }) => {
  const [reservations, dispatch] = useReducer(reducer, initialState)
  const [fetchedDateRange, setFetchedDateRange] = useState<DateRange>({ from: "", to: "" })

  return (
    <ReservationContext.Provider value={{ reservations, dispatch, fetchedDateRange, setFetchedDateRange }}>
      {children}
    </ReservationContext.Provider>
  )
}
