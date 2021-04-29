export interface CodeResponse {
  code: number
  message: string
}

export interface FacilityType {
  id: number
  name: string
}

export interface Facility {
  id: number
  name: string
  types: FacilityType[]
}

export interface UserType {
  id: number
  name: string
}

export interface User {
  id: string
  name: string
  name_ruby: string
  email_address: string
  types: UserType[]
}
