import { baseInstance, testUserToken } from '.'
import { Plan } from '@types'

export const getAllPlans = async (): Promise<Plan[]> => {
  return baseInstance.get<Plan[]>('/plan').then(res => {
    if (res.status === 200) {
      return res.data
    }
    return null
  }).catch(() => {
    return null
  })
}