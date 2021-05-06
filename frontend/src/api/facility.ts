import { baseInstance, testUserToken } from '.'
import { Facility, FacilityDTO, convertToFacility } from '@types'

export const getAllFacilities = async (): Promise<Facility[]> => {
  return baseInstance.get<FacilityDTO[]>('/facility').then(res => {
    if (res.status === 200) {
      return res.data.map(f => convertToFacility(f))
    }
    return null
  }).catch(() => {
    return null
  })
}