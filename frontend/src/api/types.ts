export interface FacilityType {
  id: number
  name: string
}

export interface Facility {
  id: number
  name: string
  types: FacilityType[]
}

export interface JWT {
  code: number
  expire: number
  token: string
}
