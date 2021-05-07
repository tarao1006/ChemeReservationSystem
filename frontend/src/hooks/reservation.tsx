import { useContext } from 'react'
import { ReservationContext } from '@contexts'
import { actions, State } from '../reducer/reservation'
import {
  getAllReservations,
  getAllReservationsInRange,
  createReservation,
  deleteReservation as deleteReservationAPI,
  updateReservation as updateReservationAPI
} from '@api'
import { Reservation } from '@types'

export const useReservations = (): {
  reservations: State,
  initReservations: () => Promise<void>
  addReservation: (reservation: Reservation, save: boolean) => Promise<void>
  deleteReservation: (reservation: Reservation, save: boolean) => Promise<void>
  updateReservation: (reservation: Reservation, save: boolean) => Promise<void>
  replaceReservation: (reservation: Reservation) => void
} => {
  const { reservations, dispatch } = useContext(ReservationContext)

  const initReservations = async () => {
    const allReservations = await getAllReservations()
    allReservations.sort((l, r) => {
      if (l.startAt.isAfter(r.startAt)) return 1
      else return -1
    })
    dispatch(actions.initReservationAction(allReservations))
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

  return { reservations, initReservations, addReservation, deleteReservation, updateReservation, replaceReservation }
}
