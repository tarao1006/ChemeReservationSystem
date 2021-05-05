import dayjs from 'dayjs'

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
	places: Facility[]
}

interface IReservation {
  id: number
	creator: User
	startAt: dayjs.Dayjs
  endAt: dayjs.Dayjs
  length: number
	plan: Plan
	planMemo: string
	createdAt: dayjs.Dayjs
	updatedAt: dayjs.Dayjs
	attendees: User[]
	places: Facility[]
}

export class Reservation implements IReservation {
  id: number
	creator: User
	startAt: dayjs.Dayjs
  endAt: dayjs.Dayjs
  length: number
	plan: Plan
	planMemo: string
	createdAt: dayjs.Dayjs
	updatedAt: dayjs.Dayjs
	attendees: User[]
	places: Facility[]

  constructor(
    id: number,
    creator: User,
    startAt: dayjs.Dayjs,
    endAt: dayjs.Dayjs,
    plan: Plan,
    planMemo: string,
    createdAt: dayjs.Dayjs,
    updatedAt: dayjs.Dayjs,
    attendees: User[],
    places: Facility[]
  ) {
    this.id = id
    this.creator = creator
    this.startAt = startAt
    this.endAt = endAt
    this.plan = plan
    this.planMemo = planMemo
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.attendees = attendees
    this.places = places

    this.length = (endAt.unix() - startAt.unix()) / 3600.0
  }

  format() {
    if (this.startAt.date === this.endAt.date) {
      const date = this.startAt.format('M[月] D[日] (dddd)')
      const endAtFormat = (this.startAt.format('A') === this.endAt.format('A')) ? 'h:mm' : 'A h:mm'
      return `${date} ・ ${this.startAt.format('A h:mm')}〜${this.endAt.format(endAtFormat)}`
    } else {
      const startDate = this.startAt.format('M[月] D[日]')
      const startTime = this.startAt.format('A h:mm')
      const endDate = this.endAt.format('M[月] D[日]')
      const endTime = this.endAt.format('A h:mm')
      return `${startDate} ${startTime}〜${endDate} ${endTime}`
    }
  }

  formatDate() {
    return this.startAt.format('M[月] D[日] (dddd')
  }

  formatStartAt() {
    return this.startAt.format('A h:mm')
  }

  formatEndAt() {
    return this.endAt.format('A h:mm')
  }
}

export interface DateRange {
  from: string
  to: string
}

export const inRange = (r: DateRange, d: dayjs.Dayjs): boolean => {
  const f = dayjs(r.from)
  const t = dayjs(r.to)
  const dateBefore = d.add(-2, 'month')
  const dateAfter = d.add(2, 'month')

  if (dateBefore.isBefore(f) || dateAfter.isAfter(t)) return false
  return true
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
  return new Reservation(
    r.id,
    convertToUser(r.creator),
    dayjs(r.start_at),
    dayjs(r.end_at),
    r.plan,
    r.plan_memo,
    dayjs(r.created_at),
    dayjs(r.updated_at),
    r.attendees.map(u => convertToUser(u)),
    r.places,
  )
}
