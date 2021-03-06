import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { MainPanel } from './MainPanel'
import { Reservation, Plan, Facility, User } from '@types'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  }),
)

export const Body = ({
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
  onPlanChange: (plan: Plan) => void
  onPlanMemoChange: (planMemo: string) => void
  onDateChange: (date: dayjs.Dayjs) => void
  onStartAtChange: (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => void
  onEndAtChange: (endAt: dayjs.Dayjs) => void
  onPlacesChange: (places: Facility[]) => void
  onAttendeesChange: (attendees: User[]) => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MainPanel
        reservation={reservation}
        onPlanChange={onPlanChange}
        onPlanMemoChange={onPlanMemoChange}
        onDateChange={onDateChange}
        onStartAtChange={onStartAtChange}
        onEndAtChange={onEndAtChange}
        onPlacesChange={onPlacesChange}
        onAttendeesChange={onAttendeesChange}
      />
    </div>
  )
}
