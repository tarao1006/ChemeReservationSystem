import { baseInstance } from '.'
import { User, UserDTO, convertToUser } from '@types'

export const getAllUsers = async (): Promise<User[]> => {
  return baseInstance.get<UserDTO[]>('/user').then(res => {
    if (res.status === 200) {
      return res.data.map(u => convertToUser(u))
    }
    return null
  }).catch(err => {
    return null
  })
}

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
