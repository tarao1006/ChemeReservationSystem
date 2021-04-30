import React, { createContext, useState } from "react"
import { Reservation } from '@api'


interface IReservationContext {
  reservations: Reservation[]
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>
}

export const ReservationContext = createContext<IReservationContext>({
  reservations: [],
  setReservations: () => {}
})

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])

  return (
    <ReservationContext.Provider value={{ reservations, setReservations }}>
      {children}
    </ReservationContext.Provider>
  )
}
