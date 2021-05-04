import { baseInstance, testUserToken } from '.'
import { Facility } from '@types'

export const getAllFacilities = async (): Promise<Facility[]> => {
  return baseInstance.get<Facility[]>('/facility').then(res => {
    if (res.status === 200) {
      return res.data
    }
    return null
  }).catch(() => {
    return null
  })
}