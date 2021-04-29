import { baseInstance } from '.'
import { Reservation, ReservationDTO, convertToReservation } from './types'

export const getReservations = async (): Promise<Reservation[]> => {
  return baseInstance.get<ReservationDTO[]>('/reservation').then(res => {
    if (res.status == 200) {
      return res.data.map(reservation => convertToReservation(reservation))
    }
    return null
  }).catch(() => {
    return null
  })
}
