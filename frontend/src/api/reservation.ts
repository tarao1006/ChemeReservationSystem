import { baseInstance } from '.'
import { Reservation, ReservationDTO, convertToReservation, DateRange, CodeResponse } from '@types'

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

export const getReservation = async (id: string): Promise<Reservation> => {
  return baseInstance.get<ReservationDTO>(`/reservation/${id}`).then(res => {
    if (res.status === 200) {
      return convertToReservation(res.data)
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

export const updateReservation = async (r: Reservation): Promise<Reservation> => {
  return baseInstance.put<ReservationDTO>(`/reservation/${r.id}`, {
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

export const deleteReservation = async (r: Reservation): Promise<CodeResponse> => {
  return baseInstance.delete<CodeResponse>(`/reservation/${r.id}`).then(res => {
    if (res.status === 204) {
      return {
        code: 204,
        message: "deleted",
      }
    }
    return null
  }).catch(() =>{
    return null
  })
}
