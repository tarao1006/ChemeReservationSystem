import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { BottomPanel } from './BottomPanel'
import { MainPanel } from './MainPanel'
import { Reservation } from '@types'

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
  setNewReservation
}: {
  reservation: Reservation
  setNewReservation: React.Dispatch<React.SetStateAction<Reservation>>
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <MainPanel reservation={reservation} setNewReservation={setNewReservation} />
      <BottomPanel />
    </div>
  )
}
