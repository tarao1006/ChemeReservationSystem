import { baseInstance, User } from '.'
import { AxiosResponse } from 'axios'

export const getMe = async (): Promise<AxiosResponse<User>> => {
  return baseInstance.get<User>('/me').then(res => {
    return res
  }).catch(err => {
    return null
  })
}
