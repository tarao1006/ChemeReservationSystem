import { useContext, Dispatch, SetStateAction } from 'react'
import { AuthContext, AuthSetContext, AuthState } from '@contexts'
import { User } from '@types'

export const useAuth = (): {
  currentUser: AuthState
  setCurrentUser: Dispatch<SetStateAction<User>>
} => {
  const currentUser = useContext(AuthContext)
  const setCurrentUser = useContext(AuthSetContext)

  return {
    currentUser,
    setCurrentUser
  }
}