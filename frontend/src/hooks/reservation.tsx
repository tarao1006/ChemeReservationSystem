import React, { useContext } from 'react'
import { ReservationsContext, ReservationsDispatchContext } from '@contexts'
import { actions, StatusType } from '../reducer/reservation'
import {
  getAllReservationsInRange,
  createReservation as createReservationAPI,
  deleteReservation as deleteReservationAPI,
  updateReservation as updateReservationAPI
} from '@api'
import { Reservation, DateRange } from '@types'

export const useReservations = (): {
  reservations: Reservation[],
  fetchedDateRange: DateRange,
  status: StatusType
  initReservations: (dateRange: DateRange) => Promise<void>
  addReservation: (reservation: Reservation) => void
  createReservation: (reservation: Reservation) => Promise<void>
  deleteReservation: (reservation: Reservation, save: boolean) => Promise<void>
  updateReservation: (reservation: Reservation, save: boolean) => Promise<void>
  replaceReservation: (reservation: Reservation) => void
} => {
  const { reservations, fetchedDateRange, status } = useContext(ReservationsContext)
  const dispatch = useContext(ReservationsDispatchContext)

  const initReservations = async (dateRange: DateRange) => {
    const allReservations = await getAllReservationsInRange(dateRange)
    allReservations.sort((l, r) => {
      if (l.startAt.isAfter(r.startAt)) return 1
      else return -1
    })
    dispatch(actions.initReservationAction(allReservations, dateRange))
  }

  const addReservation = (reservation: Reservation) => {
    dispatch(actions.addReservationAction(reservation))
  }

  const createReservation = async (reservation: Reservation) => {
    const newReservation = await createReservationAPI(reservation)
    if (newReservation) {
      dispatch(actions.createReservationAction(newReservation))
    }
  }

  const deleteReservation = async (reservation: Reservation, save: boolean) => {
    if (save) {
      const res = await deleteReservationAPI(reservation)
      if (res.code === 204) {
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

  return {
    reservations,
    fetchedDateRange,
    status,
    initReservations,
    addReservation,
    createReservation,
    deleteReservation,
    updateReservation,
    replaceReservation
  }
}
