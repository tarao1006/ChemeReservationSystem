import { useContext } from 'react'
import { UserContext, UserSetContext } from '@contexts'
import { User } from '@types'
import { getAllUsers } from '@api'

export const useUsers = (): {
  users: User[]
  initUsers: () => Promise<void>
} => {
  const users = useContext(UserContext)
  const setUsers = useContext(UserSetContext)

  const initUsers = async () => {
    const u = await getAllUsers()
    setUsers(u)
  }

  return {
    users,
    initUsers
  }
}