import { backendInstance, JWT } from '.';

export const login = async (userId: string, password: string): Promise<JWT> => {
  const res = await backendInstance.post<JWT>('/login', {
    id: userId,
    password: password,
  })

  return res.data
}

export const logout = async (): Promise<void> => {
  await backendInstance.post('/logout')
}
