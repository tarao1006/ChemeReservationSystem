import { baseInstance, Facility, testUserToken } from '.'

export const getAllFacilities = async (): Promise<Facility[]> => {
  return baseInstance.get<Facility[]>('/facility').then(res => {
    if (res.status == 200) {
      return res.data
    }
    return null
  }).catch(() => {
    return null
  })
}