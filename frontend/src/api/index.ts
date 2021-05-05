import axios from 'axios'

export const backendURL = process.env.BACKEND_URL
export const baseURL = `${backendURL}/api/v1`

export const testUserToken = process.env.TOKEN
export const testUserId = process.env.TEST_USER_ID
export const testUserPassword = process.env.TEST_USER_PASSWORD

export const backendInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  validateStatus: (status: number): boolean => {
    return status < 500
  }
})

export const baseInstance = axios.create({
  baseURL,
  withCredentials: true,
  validateStatus: (status: number): boolean => {
    return status < 500
  }
})

export { login, loginWithRememberToken, logout, validate } from './auth'
export { getAllFacilities } from './facility'
export { getAllUsers, getMe } from './user'
export { getAllReservations, getAllReservationsInRange, createReservation } from './reservation'
