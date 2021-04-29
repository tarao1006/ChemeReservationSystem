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

export interface UserDTO {
  id: string
  name: string
  name_ruby: string
  email_address: string
  types: UserType[]
}

export interface User {
  id: string
  name: string
  nameRuby: string
  emailAddress: string
  types: UserType[]
}

export interface Plan {
  id: number
  name: string
}

export interface ReservationDTO {
  id: number
	creator: UserDTO
	start_at: string
  end_at: string
	plan: Plan
	plan_memo: string
	created_at: string
	updated_at: string
	attendees:  UserDTO[]
	facilities: Facility[]
}

export interface Reservation {
  id: number
	creator: User
	startAt: Date
  endAt: Date
	plan: Plan
	planMemo: string
	createdAt: Date
	updatedAt: Date
	attendees:  User[]
	facilities: Facility[]
}

export const convertToUser = (u: UserDTO): User => {
  return {
    id: u.id,
    name: u.name,
    nameRuby: u.name_ruby,
    emailAddress: u.email_address,
    types: u.types,
  }
}

export const convertToReservation = (r: ReservationDTO): Reservation => {
  return {
    id: r.id,
    creator: convertToUser(r.creator),
    startAt: new Date(r.start_at),
    endAt: new Date(r.end_at),
    plan: r.plan,
    planMemo: r.plan_memo,
    createdAt: new Date(r.created_at),
    updatedAt: new Date(r.updated_at),
    attendees: r.attendees.map(u => convertToUser(u)),
    facilities: r.facilities,
  }
}
