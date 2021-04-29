import { baseInstance, User } from '.'

export const getMe = async (): Promise<User> => {
  const res = await baseInstance.get<User>('/me')

  return res.data
}
