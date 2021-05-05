import React from 'react'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Head } from './Head'
import { Body } from './Body'
import { Reservation, Plan, User, Facility } from '@types'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '448px',
      maxWidth: '448px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '8px',
    }
  })
)

export const ReservationNew = ({
  reservation,
  isOpen,
  onClose,
  onPlanChange,
  onPlanMemoChange,
  onDateChange,
  onStartAtChange,
  onEndAtChange,
  onPlacesChange,
  onAttendeesChange,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  margin,
}: {
  reservation: Reservation
  isOpen: boolean
  onClose: () => void
  onPlanChange: (plan: Plan) => void
  onPlanMemoChange: (planMemo: string) => void
  onDateChange: (date: dayjs.Dayjs) => void
  onStartAtChange: (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => void
  onEndAtChange: (endAt: dayjs.Dayjs) => void
  onPlacesChange: (places: Facility[]) => void
  onAttendeesChange: (attendees: User[]) => void
  anchorEl: Element
  anchorOrigin: PopoverOrigin
  transformOrigin: PopoverOrigin
  margin: {
    top: string
    left: string
  } 
}) => {
  const classes = useStyles()

  const handleClose = () => {
    onClose()
  }

  return (
    <Popover
      open={isOpen}
      onClose={handleClose}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        style: {
          marginTop: margin.top,
          marginLeft: margin.left,
        }
      }}
    >
      <div className={classes.root}>
        <Head handleClose={handleClose} />
        <Body
          handleClose={handleClose}
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
    </Popover>
  )
}
