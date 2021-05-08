import { useContext } from 'react'
import { UsersContext, UsersDispatchContext } from '@contexts'
import { User } from '@types'
import { getAllUsers } from '@api'
import { actions } from '../reducer/user'

export const useUsers = (): {
  users: User[]
  checked: string[]
  initUsers: () => Promise<void>
  addCheck: (id: string) => void
  deleteCheck: (id: string) => void
} => {
  const { users, checked } = useContext(UsersContext)
  const dispatch = useContext(UsersDispatchContext)

  const initUsers = async () => {
    const f = await getAllUsers()
    dispatch(actions.initUserAction(f))
  }

  const addCheck = (id: string) => {
    dispatch(actions.addCheckAction(id))
  }

  const deleteCheck = (id: string) => {
    dispatch(actions.deleteCheckAction(id))
  }

  return {
    users,
    checked,
    initUsers,
    addCheck,
    deleteCheck
  }
}
