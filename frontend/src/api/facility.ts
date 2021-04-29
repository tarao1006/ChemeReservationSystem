import { baseInstance, Facility, testUserToken } from '.'

export const getAllFacilities = async (): Promise<Facility> => {
  const res = await baseInstance.get<Facility>('/facility')

  return res.data
}