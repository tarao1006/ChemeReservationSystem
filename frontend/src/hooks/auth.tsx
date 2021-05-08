import { useContext, Dispatch, SetStateAction } from 'react'
import { AuthContext, AuthSetContext } from '@contexts'
import { State } from '../reducer/auth'
import { User } from '@types'

export const useAuth = (): {
  currentUser: State
  setCurrentUser: Dispatch<SetStateAction<User>>
} => {
  const currentUser = useContext(AuthContext)
  const setCurrentUser = useContext(AuthSetContext)

  return {
    currentUser,
    setCurrentUser
  }
}
