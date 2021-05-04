import React, { createContext, useState } from "react"
import { Reservation, DateRange } from '@types'

interface IReservationContext {
  reservations: Reservation[]
  fetchedDateRange: DateRange
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>
  setFetchedDateRange: React.Dispatch<React.SetStateAction<DateRange>>
}

export const ReservationContext = createContext<IReservationContext>({
  reservations: [],
  fetchedDateRange: { from: "", to: "" },
  setReservations: () => {},
  setFetchedDateRange: () => {}
})

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [fetchedDateRange, setFetchedDateRange] = useState<DateRange>({ from: "", to: "" })

  return (
    <ReservationContext.Provider value={{ reservations, fetchedDateRange, setReservations, setFetchedDateRange }}>
      {children}
    </ReservationContext.Provider>
  )
}
