import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Plan, PlanIcon } from './Plan'
import { Date, DateIcon } from './Date'
import { Place, PlaceIcon } from './Place'
import { Attendee, AttendeeIcon } from './Attendee'
import { Reservation, Plan as PlanModel, User, Facility } from '@types'
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
  onPlanChange,
  onPlanMemoChange,
  onDateChange,
  onStartAtChange,
  onEndAtChange,
  onPlacesChange,
  onAttendeesChange
}: {
  reservation: Reservation
  onPlanChange: (plan: PlanModel) => void
  onPlanMemoChange: (planMemo: string) => void
  onDateChange: (date: dayjs.Dayjs) => void
  onStartAtChange: (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => void
  onEndAtChange: (endAt: dayjs.Dayjs) => void
  onPlacesChange: (places: Facility[]) => void
  onAttendeesChange: (attendees: User[]) => void
}) => {
  const classes = useStyles()

  const handlePlanChange = (plan: PlanModel) => {
    onPlanChange(plan)
  }

  const handlePlanMemoChange = (planMemo: string) => {
    onPlanMemoChange(planMemo)
  }

  const handleDateChange = (date: dayjs.Dayjs) => {
    onDateChange(date)
  }

  const handleStartAtChange = (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => {
    onStartAtChange(startAt, endAt)
  }

  const handleEndAtChange = (endAt: dayjs.Dayjs) => {
    onEndAtChange(endAt)
  }

  const handlePlacesChange = (places: Facility[]) => {
    onPlacesChange(places)
  }

  const handleAttendeesChange = (attendees: User[]) => {
    onAttendeesChange(attendees)
  }

  return (
    <div className={classes.root}>

      <div className={classes.wrap}>
        <div className={classes.container}>
          <PlanIcon />
          <div className={classes.main}>
            <Plan
              plan={reservation.plan}
              planMemo={reservation.planMemo}
              onPlanChange={handlePlanChange}
              onPlanMemoChange={handlePlanMemoChange}
            />
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
            <Place
              places={reservation.places}
              onPlacesChange={handlePlacesChange}
            />
          </div>
        </div>
      </div>

      <div className={classes.wrap}>
        <div className={classes.container}>
          <AttendeeIcon />
          <div className={classes.main}>
            <Attendee
              attendees={reservation.attendees}
              onAttendeesChange={handleAttendeesChange}
            />
          </div>
        </div>
      </div>

    </div>
  )
}