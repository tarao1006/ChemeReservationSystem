import { Reservation, DateRange } from '@types'

const INIT_RESERVATION = "INIT_RESERVATION" as const
const RESET_STATUS = "REST_STATUS" as const

const initReservationAction = (reservations: Reservation[], dateRange: DateRange) => {
  return { type: INIT_RESERVATION, payload: { reservations, dateRange } }
}

const resetStatusAction = () => {
  return { type: RESET_STATUS, payload: '' }
}

// without api request
const ADD_RESERVATION = "ADD_RESERVATION" as const
const REMOVE_RESERVATION = "REMOVE_RESERVATION" as const
const EDIT_RESERVATION = "EDITED_RESERVATION" as const
const REPLACE_RESERVATION = "REPLACE_RESERVATION" as const

const addReservationAction = (reservation: Reservation) => {
  return { type: ADD_RESERVATION, payload: reservation }
}

const removeReservationAction = (reservation: Reservation) => {
  return { type: REMOVE_RESERVATION, payload: reservation }
}

const editReservationAction = (reservation: Reservation) => {
  return { type: EDIT_RESERVATION, payload: reservation }
}

const replaceReservationAction = (reservation: Reservation) => {
  return { type: REPLACE_RESERVATION, payload: reservation }
}

// with api request
const CREATE_RESERVATION = "CREATE_RESERVATION" as const
const DELETE_RESERVATION = "DELETE_RESERVATION" as const
const UPDATE_RESERVATION = "UPDATE_RESERVATION" as const

const createReservationAction = (reservation: Reservation) => {
  return { type: CREATE_RESERVATION, payload: reservation }
}

const deleteReservationAction = (reservation: Reservation) => {
  return { type: DELETE_RESERVATION, payload: reservation }
}

const updateReservationAction = (reservation: Reservation) => {
  return { type: UPDATE_RESERVATION, payload: reservation }
}

export const actions = {
  initReservationAction,
  resetStatusAction,
  addReservationAction,
  removeReservationAction,
  editReservationAction,
  replaceReservationAction,
  createReservationAction,
  deleteReservationAction,
  updateReservationAction,
}

export type ActionType =
  | ReturnType<typeof initReservationAction>
  | ReturnType<typeof resetStatusAction>
  | ReturnType<typeof addReservationAction>
  | ReturnType<typeof removeReservationAction>
  | ReturnType<typeof editReservationAction>
  | ReturnType<typeof replaceReservationAction>
  | ReturnType<typeof createReservationAction>
  | ReturnType<typeof deleteReservationAction>
  | ReturnType<typeof updateReservationAction>

export type StatusType =
  | ''
  | 'added'
  | 'removed'
  | 'edited'
  | 'created'
  | 'deleted'
  | 'updated'

export type State = {
  reservations: Reservation[],
  fetchedDateRange: DateRange,
  status: StatusType
}

export const initialState: State = {
  reservations: [],
  fetchedDateRange: {
    from: '',
    to: '',
  },
  status: '',
}

export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case INIT_RESERVATION:
      return {
        ...state,
        reservations: action.payload.reservations,
        fetchedDateRange: action.payload.dateRange
      }
    case ADD_RESERVATION:
      return addReservation(state, action)
    case REMOVE_RESERVATION:
      return removeReservation(state, action)
    case EDIT_RESERVATION:
      return editReservation(state, action)
    case REPLACE_RESERVATION:
      return replaceReservation(state, action)
    case CREATE_RESERVATION:
      return createdReservation(state, action)
    case DELETE_RESERVATION:
      return deleteReservation(state, action)
    case UPDATE_RESERVATION:
      return updateReservation(state, action)
    case RESET_STATUS:
      return {
        ...state,
        status: ''
      }
    default:
      return {...state}
  }
}

const addReservation = (state: State, action: ActionType): State => {
  const reservation = action.payload as Reservation
  const newState = {...state}
  newState.reservations = newState.reservations.filter(r => r.id !== 0)
  const index = getIndex(newState.reservations, reservation)
  newState.reservations.splice(index, 0, reservation)
  return {...newState, status: 'added'}
}

const removeReservation = (state: State, action: ActionType): State => {
  return {
    ...state,
    status: 'removed',
    reservations: state.reservations.filter(r => r.id !== (action.payload as Reservation).id)
  }
}

const editReservation = (state: State, action: ActionType): State => {
  return {
    ...state,
    status: 'edited',
    reservations: state.reservations.map(r => {
      if (r.id === (action.payload as Reservation).id) {
        return action.payload as Reservation
      }
      return r
    })
  }
}

const replaceReservation = (state: State, action: ActionType): State => {
  const reservation = action.payload as Reservation
  const newReservations = state.reservations.filter(r => r.id !== reservation.id)
  const index = getIndex(newReservations, reservation)
  newReservations.splice(index, 0, reservation)
  return {
    ...state,
    status: '',
    reservations: newReservations
  }
}

const createdReservation = (state: State, action: ActionType): State => {
  const reservation = action.payload as Reservation
  const newState = {...state}
  newState.reservations = newState.reservations.filter(r => r.id !== 0)
  const index = getIndex(newState.reservations, reservation)
  newState.reservations.splice(index, 0, reservation)
  return {...newState, status: 'created'}
}

const deleteReservation = (state: State, action: ActionType): State => {
  return {
    ...state,
    status: 'deleted',
    reservations: state.reservations.filter(r => r.id !== (action.payload as Reservation).id)
  }
}

const updateReservation = (state: State, action: ActionType): State => {
  return {
    ...state,
    status: 'updated',
    reservations: state.reservations.map(r => {
      if (r.id === (action.payload as Reservation).id) {
        return action.payload as Reservation
      }
      return r
    })
  }
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
