import { backendInstance, CodeResponse, ValidateResult } from '.';

export const login = async (userId: string, password: string, rememberMe: boolean): Promise<string> => {
  return backendInstance.post<CodeResponse>('/login', {
    id: userId,
    password: password,
    remember_me: rememberMe,
  }).then(res => {
    return res.headers['authorization'].split(' ')[1]
  }).catch(() => {
    return ""
  })
}

export const loginWithRememberToken = async (): Promise<string> => {
  return backendInstance.post<CodeResponse>('/login').then(res => {
    return res.headers['authorization'].split(' ')[1]
  }).catch(() => {
    return ""
  })
}

export const logout = async (token: string): Promise<void> => {
  await backendInstance.post('/logout', {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const validate = async (userId: string) => {
  const res = await backendInstance.post<ValidateResult>('/validate', {
    user_id: userId,
  })

  return res.data
}
