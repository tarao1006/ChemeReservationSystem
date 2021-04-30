import { baseInstance } from '.'
import { Reservation, ReservationDTO, convertToReservation, DateRange } from './types'

export const getAllReservations = async (): Promise<Reservation[]> => {
  return baseInstance.get<ReservationDTO[]>('/reservation').then(res => {
    if (res.status === 200) {
      return res.data.map(reservation => convertToReservation(reservation))
    }
    return null
  }).catch(() => {
    return null
  })
}

export const getAllReservationsInRange = async (r: DateRange): Promise<Reservation[]> => {
  return baseInstance.get<ReservationDTO[]>('/reservation', {
    params: {
      from: r.from,
      to: r.to,
    },
  }).then(res => {
    if (res.status === 200) {
      return res.data.map(reservation => convertToReservation(reservation))
    }
    return null
  }).catch(() => {
    return null
  })
}

