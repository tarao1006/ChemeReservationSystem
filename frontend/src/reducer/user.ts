import { User } from '@types'

const INIT_USER = "INIT_USER" as const
const ADD_CHECK = "ADD_CHECK" as const
const DELETE_CHECK = "DELETE_CHECK" as const

const initUserAction = (facilities: User[]) => {
  return { type: INIT_USER, payload: facilities }
}

const addCheckAction = (id: string) => {
  return { type: ADD_CHECK, payload: id }
}

const deleteCheckAction = (id: string) => {
  return { type: DELETE_CHECK, payload: id }
}

export const actions = {
  initUserAction,
  addCheckAction,
  deleteCheckAction
}

export type ActionType =
  | ReturnType<typeof initUserAction>
  | ReturnType<typeof addCheckAction>
  | ReturnType<typeof deleteCheckAction>

export type State = {
  users: User[],
  checked: string[]
}

export const initialState: State = {
  users: [],
  checked: []
}

export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case INIT_USER:
      return {
        ...state,
        users: action.payload,
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
