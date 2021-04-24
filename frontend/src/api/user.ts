import { baseInstance, User } from '.'

export const getMe = async (token: string): Promise<User> => {
  const res = await baseInstance.get<User>('/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return res.data
}
