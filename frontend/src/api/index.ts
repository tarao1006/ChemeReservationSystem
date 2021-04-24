import axios from 'axios'

export const backendURL = process.env.BACKEND_URL
export const baseURL = `${backendURL}/api/v1`

export const testUserToken = process.env.TOKEN
export const testUserID = process.env.TEST_USER_ID
export const testUserPassword = process.env.TEST_USER_PASSWORD

export const backendInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
})

export const baseInstance = axios.create({
  baseURL,
  withCredentials: true,
})

export { login, logout } from './auth'
export { getAllFacilities } from './facility'
export { Facility, JWT } from './types'
