import { backendInstance, JWT, testUserID, testUserPassword } from '.';

export const login = async (): Promise<JWT> => {
  const res = await backendInstance.post<JWT>('/login', {
    id: testUserID,
    password: testUserPassword,
  })

  return res.data
}

export const logout = async (): Promise<void> => {
  await backendInstance.post('/logout')
}
