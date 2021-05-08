import { Facility } from '@types'

const INIT_FACILITY = "INIT_FACILITY" as const
const ADD_CHECK = "ADD_CHECK" as const
const DELETE_CHECK = "DELETE_CHECK" as const

const initFacilityAction = (facilities: Facility[]) => {
  return { type: INIT_FACILITY, payload: facilities }
}

const addCheckAction = (id: number) => {
  return { type: ADD_CHECK, payload: id }
}

const deleteCheckAction = (id: number) => {
  return { type: DELETE_CHECK, payload: id }
}

export const actions = {
  initFacilityAction,
  addCheckAction,
  deleteCheckAction
}

export type ActionType =
  | ReturnType<typeof initFacilityAction>
  | ReturnType<typeof addCheckAction>
  | ReturnType<typeof deleteCheckAction>

export type State = {
  facilities: Facility[],
  checked: number[]
}

export const initialState: State = {
  facilities: [],
  checked: []
}

export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case INIT_FACILITY:
      return {
        ...state,
        facilities: action.payload,
        checked: action.payload.map(p => p.id)
      }
    case ADD_CHECK:
      const newChecked = [...state.checked]
      newChecked.push(action.payload)
      return {
        ...state,
        checked: newChecked
      }
    case DELETE_CHECK:
      return {
        ...state,
        checked: state.checked.filter(c => c !== action.payload)
      }
    default:
      return {...state}
  }
}
