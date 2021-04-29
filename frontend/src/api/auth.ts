import { backendInstance, CodeResponse } from '.';

export const login = async (userId: string, password: string, rememberMe: boolean): Promise<CodeResponse> => {
  return backendInstance.post<CodeResponse>('/login', {
    id: userId,
    password: password,
    remember_me: rememberMe,
  }).then(res => {
    return res.data
  }).catch(err => {
    return null
  })
}

export const loginWithRememberToken = async (): Promise<CodeResponse> => {
  return backendInstance.post<CodeResponse>('/login').then(res => {
    return res.data
  }).catch(() => {
    return null
  })
}

export const logout = async (): Promise<void> => {
  await backendInstance.post('/logout')
}

export const validate = async (userId: string): Promise<CodeResponse> => {
  return backendInstance.post<CodeResponse>('/validate', {
    user_id: userId,
  }).then(res => {
    return res.data
  }).catch(() => {
    return null
  })
}
