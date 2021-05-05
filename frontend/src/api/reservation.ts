import { baseInstance } from '.'
import { Reservation, ReservationDTO, convertToReservation, DateRange } from '@types'

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

export const createReservation = async (r: Reservation): Promise<Reservation> => {
  return baseInstance.post<ReservationDTO>('/reservation', {
    creator_id: r.creator.id,
    start_at: r.startAt.format(),
    end_at: r.endAt.format(),
    plan_id: r.plan.id,
    plan_memo: r.planMemo,
    user_ids: r.attendees.map(attendee => attendee.id),
    facility_ids: r.places.map(place => place.id)
  }).then(res => {
    if (res.status === 200) {
      return convertToReservation(res.data)
    }
    return null
  }).catch(() =>{
    return null
  })
}
