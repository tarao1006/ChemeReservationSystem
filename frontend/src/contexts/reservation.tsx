import React, { createContext, useReducer, useState, Dispatch } from "react"
import { DateRange } from '@types'
import {
  initialState,
  reducer,
  State,
  ActionType,
} from '../reducer/reservation'

interface IReservationContext {
  fetchedDateRange: DateRange
  setFetchedDateRange: React.Dispatch<React.SetStateAction<DateRange>>
}

export const ReservationsContext = createContext<State>({
  reservations: [],
  range: {
    from: '',
    to: '',
  }
})

export const ReservationsDispatchContext = createContext<Dispatch<ActionType>>(null)

export const ReservationContext = createContext<IReservationContext>({
  fetchedDateRange: { from: "", to: "" },
  setFetchedDateRange: () => {}
})

export const ReservationProvider = ({ children }) => {
  const [reservations, dispatch] = useReducer(reducer, initialState)
  const [fetchedDateRange, setFetchedDateRange] = useState<DateRange>({ from: "", to: "" })

  return (
    <ReservationsContext.Provider value={reservations}>
      <ReservationsDispatchContext.Provider value={dispatch}>
          <ReservationContext.Provider value={{ fetchedDateRange, setFetchedDateRange }}>
          {children}
        </ReservationContext.Provider>
      </ReservationsDispatchContext.Provider>
    </ReservationsContext.Provider>
  )
}
