import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Plan, PlanIcon } from './Plan'
import { Date, DateIcon } from './Date'
import { Place, PlaceIcon } from './Place'
import { Attendee, AttendeeIcon } from './Attendee'
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
    wrap: {
      display: 'block',
      width: '100%',
      margin: '8px 0 8px',
      fontSize: '14px',
    },
    container: {
      display: 'flex',
      margin: '2px 16px 0',
      alignItems: 'flex-start',
    },
    main: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
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

      <div className={classes.wrap}>
        <div className={classes.container}>
          <PlanIcon />
          <div className={classes.main}>
            <Plan />
          </div>
        </div>
      </div>

      <div className={classes.wrap}>
        <div className={classes.container}>
          <DateIcon />
          <div className={classes.main}>
            <Date
              reservation={reservation}
              onDateChange={handleDateChange}
              onStartAtChange={handleStartAtChange}
              onEndAtChange={handleEndAtChange}
            />
          </div>
        </div>
      </div>

      <div className={classes.wrap}>
        <div className={classes.container}>
          <PlaceIcon />
          <div className={classes.main}>
            <Place />
          </div>
        </div>
      </div>

      <div className={classes.wrap}>
        <div className={classes.container}>
          <AttendeeIcon />
          <div className={classes.main}>
            <Attendee />
          </div>
        </div>
      </div>

    </div>
  )
}