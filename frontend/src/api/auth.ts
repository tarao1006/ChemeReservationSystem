import { backendInstance, JWT } from '.';

export const login = async (userId: string, password: string, remember: boolean): Promise<JWT> => {
  const res = await backendInstance.post<JWT>('/login', {
    id: userId,
    password: password,
    remember: remember,
  })

  return res.data
}

export const logout = async (): Promise<void> => {
  await backendInstance.post('/logout')
}
