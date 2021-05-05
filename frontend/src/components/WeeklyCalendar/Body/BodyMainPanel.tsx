import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation as ReservationModel, Plan, Facility, User } from '@types'
import { AuthContext, ReservationContext } from '@contexts'
import dayjs from 'dayjs'
import { Reservation } from './Reservation'
import { createReservation } from '@api'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowX: 'auto',
      overflowY: 'scroll',
      display: 'flex',
      alignItems: 'flex-start',
      flex: '1 1 auto'
    },
    wrap: {
      minWidth: '100%',
      flex: 'none',
      display: 'inline-flex',
      verticalAlign: 'top',
      overflow: 'hidden',
      position: 'relative',
    },
    hiddenColumn: {
      borderTop: '#dadce0 1px solid',
    },
    hiddenColumnCell: {
      height: '48px',
      '&::after': {
        zIndex: 3,
        content: "''",
        position: 'absolute',
        width: '100%',
        marginTop: '-1px',
        borderBottom: '#dadce0 1px solid',
      }
    },
    gutter: {
      width: '9px',
      borderRight: '#dadce0 1px solid',
    },
    column: {
      width: '81px',
      minWidth: '81px',
      flex: '1 0 auto',
      borderRight: '#dadce0 1px solid',
      position: 'relative',
      paddingRight: '12px',
      boxSizing: 'border-box',
      outline: 'none',
    },
    columnContent: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 5,
    },
    columnContentPresentation: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
  }),
)

const BodyMainPanelContentCell = () => {
  const classes = useStyles()

  const times = [
    '午前12時', '午前1時', '午前2時', '午前3時', '午前4時', '午前5時', '午前6時', '午前7時', '午前8時', '午前9時', '午前10時', '午前11時',
    '午後12時', '午後1時', '午後2時', '午後3時', '午後4時', '午後5時', '午後6時', '午後7時', '午後8時', '午後9時', '午後10時', '午後11時',
  ]

  return (
    <div className={classes.hiddenColumn}>
      {times.map(time => (
        <div key={time} className={classes.hiddenColumnCell} />
      ))}
    </div>
  )
}

const BodyMainPanelContentColumn = ({
  date
}: {
  date: dayjs.Dayjs
}) => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const { reservations, setReservations } = useContext(ReservationContext)
  const [index, setIndex] = useState<number>(-1)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetY = e.nativeEvent.offsetY
    const offsetAllMinutes = Math.floor(offsetY / 12.0) * 15
    const offsetHour = Math.floor(offsetAllMinutes / 60.0)
    const offsetMinutes = offsetAllMinutes - offsetHour * 60.0
    const startAt = date.hour(offsetHour).minute(offsetMinutes)
    const endAt = date.hour(offsetHour).minute(offsetMinutes).add(1, 'hour')
    const plan = { id: 1, name: '会議' }
    const now = dayjs()

    addReservations(new ReservationModel(0, currentUser, startAt, endAt, plan, '', now, now, [], []))
  }

  const handlePlanChange = (plan: Plan) => {
    const reservation = reservations[index]
    const newReservation = (new ReservationModel(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
    updateReservations(newReservation)
  }

  const handlePlanMemoChange = (planMemo: string) => {
    const reservation = reservations[index]
    updateReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handlePlacesChange = (places: Facility[]) => {
    const reservation = reservations[index]
    updateReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      places,
    ))
  }

  const handleAttendeesChange = (attendees: User[]) => {
    const reservation = reservations[index]
    updateReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      attendees,
      reservation.places,
    ))
  }

  const handleDateChange = (date: dayjs.Dayjs) => {
    const reservation = reservations[index]
    const newStartAt = date.hour(reservation.startAt.hour()).minute(reservation.startAt.minute())
    const newEndAt = date.hour(reservation.endAt.hour()).minute(reservation.endAt.minute())
    replaceReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      newStartAt,
      newEndAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handleStartAtChange = (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => {
    const reservation = reservations[index]
    replaceReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      startAt,
      endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handleEndAtChange = (endAt: dayjs.Dayjs) => {
    const reservation = reservations[index]
    replaceReservations(new ReservationModel(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const addReservations = (newReservation: ReservationModel) => {
    const newReservations = [...reservations]
    let newIndex = 0
    for (let i = 0; i < newReservations.length; ++i) {
      if (newReservations[i].startAt.isBefore(newReservation.startAt)) {
        newIndex = i
        break
      }
    }

    newReservations.splice(newIndex, 0, newReservation)
    setIndex(newIndex)
    setReservations(newReservations)
  }

  const updateReservations = (newReservation: ReservationModel) => {
    const newReservations = [...reservations]
    newReservations.splice(index, 1, newReservation)
    setReservations(newReservations)
  }

  const replaceReservations = (newReservation: ReservationModel) => {
    const newReservations = [...reservations]
    newReservations.splice(index, 1)

    let newIndex = 0
    for (let i = 0; i < newReservations.length; ++i) {
      if (newReservations[i].startAt.isBefore(newReservation.startAt)) {
        newIndex = i
        break
      }
    }

    newReservations.splice(newIndex, 0, newReservation)
    setIndex(newIndex)
    setReservations(newReservations)
  }

  const handleClose = () => {
    if (index >= 0) {
      const newReservations = [...reservations]
      newReservations.splice(index, 1)
      setIndex(-1)
      setReservations(newReservations)
    }
  }

  const handleSubmit = async () => {
    const newReservations = [...reservations]
    const newReservation = newReservations[index]

    const res = await createReservation(newReservation)

    newReservations.splice(index, 1, res)
    setIndex(-1)
    setReservations(newReservations)
  }

  return (
    <div className={classes.column}>
      <div className={classes.columnContent} onClick={handleClick} />
      <div className={classes.columnContentPresentation}>
        {reservations.filter(reservation => reservation.startAt.isSame(date, 'day')).map(reservation => (
          <Reservation
            key={reservation.id}
            reservation={reservation}
            onClose={handleClose}
            onSubmit={handleSubmit}
            onPlanChange={handlePlanChange}
            onPlanMemoChange={handlePlanMemoChange}
            onDateChange={handleDateChange}
            onStartAtChange={handleStartAtChange}
            onEndAtChange={handleEndAtChange}
            onPlacesChange={handlePlacesChange}
            onAttendeesChange={handleAttendeesChange}
          />
        ))}
      </div>
    </div>
  )
}

const BodyMainPanelContent = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()

  return (
    <div className={classes.wrap}>
      <BodyMainPanelContentCell />
      <div className={classes.gutter} />
      {dates.map(date => (
        <BodyMainPanelContentColumn
          key={date.format()}
          date={date}
        />
      ))}
    </div>
  )
}

export const BodyMainPanel = ({
  dates,
  setScrollTop
}: {
  dates: dayjs.Dayjs[]
  setScrollTop(scrollTop: number): void
}) => {
  const classes = useStyles()

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = (e.target as HTMLDivElement).scrollTop
    setScrollTop(top)
  }

  return (
    <div className={classes.root} onScroll={handleScroll}>
      <BodyMainPanelContent dates={dates} />
    </div>
  )
}
