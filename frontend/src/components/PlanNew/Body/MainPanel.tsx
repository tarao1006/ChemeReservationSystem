import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Plan } from './Plan'
import { Date } from './Date'
import { Place } from './Place'
import { Attendee } from './Attendee'
import { Reservation } from '@types'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      overflowX: 'hidden',
      overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
)

export const MainPanel = ({
  reservation,
  setNewReservation
}: {
  reservation: Reservation
  setNewReservation: React.Dispatch<React.SetStateAction<Reservation>>
}) => {
  const classes = useStyles()

  const handleChangeTitle = () => {
  }

  const handleDateChange = (date: dayjs.Dayjs) => {
    console.log(date.format())
  }

  const handleStartAtChange = (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => {
    setNewReservation(new Reservation(
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
    setNewReservation(new Reservation(
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

  return (
    <div className={classes.root}>
      <Plan />
      <Date
        reservation={reservation}
        onDateChange={handleDateChange}
        onStartAtChange={handleStartAtChange}
        onEndAtChange={handleEndAtChange}
      />
      <Place />
      <Attendee />
    </div>
  )
}