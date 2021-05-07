import { Reservation } from '@types'

const INIT_RESERVATION = "INIT_RESERVATION" as const
const ADD_RESERVATION = "ADD_RESERVATION" as const
const DELETE_RESERVATION = "DELETE_RESERVATION" as const
const UPDATE_RESERVATION = "UPDATE_RESERVATION" as const
const REPLACE_RESERVATION = "REPLACE_RESERVATION" as const

const initReservationAction = (reservations: Reservation[]) => {
  return { type: INIT_RESERVATION, payload: reservations }
}

const addReservationAction = (reservation: Reservation) => {
  return { type: ADD_RESERVATION, payload: reservation }
}

const deleteReservationAction = (reservation: Reservation) => {
  return { type: DELETE_RESERVATION, payload: reservation }
}

const updateReservationAction = (reservation: Reservation) => {
  return { type: UPDATE_RESERVATION, payload: reservation }
}

const replaceReservationAction = (reservation: Reservation) => {
  return { type: REPLACE_RESERVATION, payload: reservation }
}

export const actions = {
  initReservationAction,
  addReservationAction,
  deleteReservationAction,
  updateReservationAction,
  replaceReservationAction
}

export type ActionType =
  | ReturnType<typeof initReservationAction>
  | ReturnType<typeof addReservationAction>
  | ReturnType<typeof deleteReservationAction>
  | ReturnType<typeof updateReservationAction>
  | ReturnType<typeof replaceReservationAction>

export type State = Reservation[]

export const initialState: State = []

export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case INIT_RESERVATION:
      return [...action.payload]
    case ADD_RESERVATION:
      return addReservation(state, action)
    case DELETE_RESERVATION:
      return deleteReservation(state, action)
    case UPDATE_RESERVATION:
      return updateReservation(state, action)
    case REPLACE_RESERVATION:
      return replaceReservation(state, action)
    default:
      return [...state]
  }
}

const addReservation = (state: State, action: ActionType): State => {
  const reservation = action.payload as Reservation
  const newState = [...state]
  const index = getIndex(newState, reservation)
  newState.splice(index, 0, reservation)
  return newState
}

const deleteReservation = (state: State, action: ActionType): State => {
  return state.filter(r => r.id !== (action.payload as Reservation).id)
}

const updateReservation = (state: State, action: ActionType): State => {
  return state.map(r => {
    if (r.id === (action.payload as Reservation).id) {
      return action.payload as Reservation
    }
    return r
  })
}

const replaceReservation = (state: State, action: ActionType): State => {
  const reservation = action.payload as Reservation
  const newState = state.filter(r => r.id !== reservation.id)
  const index = getIndex(newState, reservation)
  newState.splice(index, 0, reservation)
  return newState
}

const getIndex = (
  reservations: Reservation[],
  reservation: Reservation
): number => {
  let index = 0

  for (let i = 0; i < reservations.length - 1; ++i) {
    if (reservations[i].startAt.isBefore(reservation.startAt) && reservation.startAt.isBefore(reservations[i + 1].startAt)) {
      index = i
      break
    }
  }

  return index
}
