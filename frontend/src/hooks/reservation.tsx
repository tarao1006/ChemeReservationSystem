import { useContext } from 'react'
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
  resetStatus: () => void
  addReservation: (reservation: Reservation) => void
  removeReservation: (reservation: Reservation) => void
  editReservation: (reservation: Reservation) => void
  replaceReservation: (reservation: Reservation) => void
  createReservation: (reservation: Reservation) => Promise<void>
  deleteReservation: (reservation: Reservation) => Promise<void>
  updateReservation: (reservation: Reservation) => Promise<void>
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

  const resetStatus = () => {
    dispatch(actions.resetStatusAction())
  }

  const addReservation = (reservation: Reservation) => {
    dispatch(actions.addReservationAction(reservation))
  }

  const removeReservation = (reservation: Reservation) => {
    if (reservation.id === 0) {
      dispatch(actions.removeReservationAction(reservation))
    }
  }

  const editReservation = (reservation: Reservation) => {
    dispatch(actions.editReservationAction(reservation))
  }

  const replaceReservation = (reservation: Reservation) => {
    dispatch(actions.replaceReservationAction(reservation))
  }

  const createReservation = async (reservation: Reservation) => {
    const newReservation = await createReservationAPI(reservation)
    if (newReservation) {
      dispatch(actions.createReservationAction(newReservation))
    }
  }

  const deleteReservation = async (reservation: Reservation) => {
    const res = await deleteReservationAPI(reservation)
    if (res.code === 204) {
      dispatch(actions.deleteReservationAction(reservation))
    }
  }

  const updateReservation = async (reservation: Reservation) => {
    const newReservation = await updateReservationAPI(reservation)
    if (newReservation) {
      dispatch(actions.updateReservationAction(newReservation))
    }
  }

  return {
    reservations,
    fetchedDateRange,
    status,
    initReservations,
    resetStatus,
    addReservation,
    removeReservation,
    editReservation,
    createReservation,
    deleteReservation,
    updateReservation,
    replaceReservation
  }
}
