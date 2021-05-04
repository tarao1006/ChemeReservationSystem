import { baseInstance } from '.'
import { User, UserDTO, convertToUser } from '@types'

export const getMe = async (): Promise<User> => {
  return baseInstance.get<UserDTO>('/me').then(res => {
    if (res.status === 200) {
      return convertToUser(res.data)
    }
    return null
  }).catch(err => {
    return null
  })
}
