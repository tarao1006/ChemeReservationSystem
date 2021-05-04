import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation } from '@types'
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
    facility: {

    },
  })
)

export const Body = ({ reservation }: { reservation: Reservation }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <BodyTitle reservation={reservation} />
      </div>
      <div className={classes.facility}>
        {reservation.facilities[0].name}
      </div>
    </div>
  )
}