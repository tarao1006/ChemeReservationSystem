import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import { Reservation, Facility, User } from '@types'
import { BodyTitle } from './BodyTitle'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      overflowX: 'hidden',
      overflowY: 'scroll',
      paddingBottom: '16px',
      paddingTop: 0,
      paddingLeft: '12px',
    },
    title: {
      minHeight: '32px',
      marginBottom: '12px',
      width: '100%',
      position: 'relative',
      display: 'flex',
      paddingRight: '16px',
      boxSizing: 'border-box',
      alignItems: 'center',
      outline: 'none',
    },
    chips: {
      display: 'flex',
      overflowX: 'scroll',
      paddingTop: '8px',
      paddingBottom: '8px',
    },
    chip: {
      flex: 'none',
      fontSize: '14px',
      margin: '2px',
    }
  })
)

const FacilityChip = ({ facility }: { facility: Facility }) => {
  const classes = useStyles()

  return (
    <Chip
      className={classes.chip}
      label={facility.name}
      variant="outlined"
    />
  )
}

const UserChip = ({ user }: { user: User }) => {
  const classes = useStyles()

  return (
    <Chip
      className={classes.chip}
      label={user.name}
      variant="outlined"
    />
  )
}

export const Body = ({ reservation }: { reservation: Reservation }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <BodyTitle reservation={reservation} />
      </div>
      <div className={classes.chips}>
        {reservation.attendees.map(attendee => (
          <UserChip key={attendee.id} user={attendee} />
        ))}
      </div>
      <div className={classes.chips}>
        {reservation.places.map(place => (
          <FacilityChip key={place.id} facility={place} />
        ))}
      </div>
    </div>
  )
}