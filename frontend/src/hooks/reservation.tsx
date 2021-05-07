import React, { useContext } from 'react'
import { ReservationContext, ReservationsContext, ReservationsDispatchContext } from '@contexts'
import { actions } from '../reducer/reservation'
import {
  getAllReservationsInRange,
  createReservation,
  deleteReservation as deleteReservationAPI,
  updateReservation as updateReservationAPI
} from '@api'
import { Reservation, DateRange } from '@types'

export const useReservations = (): {
  reservations: Reservation[],
  fetchedDateRange: DateRange
  initReservations: (dateRange: DateRange) => Promise<void>
  addReservation: (reservation: Reservation, save: boolean) => Promise<void>
  deleteReservation: (reservation: Reservation, save: boolean) => Promise<void>
  updateReservation: (reservation: Reservation, save: boolean) => Promise<void>
  replaceReservation: (reservation: Reservation) => void
} => {
  const { reservations } = useContext(ReservationsContext)
  const dispatch = useContext(ReservationsDispatchContext)
  const { fetchedDateRange, setFetchedDateRange } = useContext(ReservationContext)

  const initReservations = async (dateRange: DateRange) => {
    const allReservations = await getAllReservationsInRange(dateRange)
    allReservations.sort((l, r) => {
      if (l.startAt.isAfter(r.startAt)) return 1
      else return -1
    })
    setFetchedDateRange(dateRange)
    dispatch(actions.initReservationAction(allReservations, dateRange))
  }

  const addReservation = async (reservation: Reservation, save: boolean) => {
    if (save) {
      const newReservation = await createReservation(reservation)
      if (newReservation) {
        dispatch(actions.addReservationAction(newReservation))
      }
    } else {
      dispatch(actions.addReservationAction(reservation))
    }
  }

  const deleteReservation = async (reservation: Reservation, save: boolean) => {
    if (save) {
      const res = await deleteReservationAPI(reservation)
      if (res.code === 204) {
        console.log('delete')
        dispatch(actions.deleteReservationAction(reservation))
      }
    } else {
      if (reservation.id === 0) {
        dispatch(actions.deleteReservationAction(reservation))
      }
    }
  }

  const updateReservation = async (reservation: Reservation, save: boolean) => {
    if (save) {
      const newReservation = await updateReservationAPI(reservation)
      if (newReservation) {
        dispatch(actions.updateReservationAction(newReservation))
      }
    } else {
      dispatch(actions.updateReservationAction(reservation))
    }
  }

  const replaceReservation = (reservation: Reservation) => {
    dispatch(actions.replaceReservationAction(reservation))
  }

  return { reservations, fetchedDateRange, initReservations, addReservation, deleteReservation, updateReservation, replaceReservation }
}
