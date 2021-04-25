import { backendInstance, JWT, ValidateResult } from '.';

export const login = async (userId: string, password: string, rememberMe: boolean): Promise<JWT> => {
  const res = await backendInstance.post<JWT>('/login', {
    id: userId,
    password: password,
    remember_me: rememberMe,
  })

  return res.data
}

export const logout = async (): Promise<void> => {
  await backendInstance.post('/logout')
}

export const validate = async (userId: string) => {
  const res = await backendInstance.post<ValidateResult>('/validate', {
    user_id: userId,
  })

  return res.data
}
