import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { BottomPanel } from './BottomPanel'
import { MainPanel } from './MainPanel'
import { Reservation } from '@types'
import { createReservation } from '@api'

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
  setNewReservation,
  handleClose
}: {
  reservation: Reservation
  setNewReservation: React.Dispatch<React.SetStateAction<Reservation>>
  handleClose: () => void
}) => {
  const classes = useStyles()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createReservation(reservation)
    handleClose()
  }

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <MainPanel reservation={reservation} setNewReservation={setNewReservation} />
        <BottomPanel />
      </form>
    </div>
  )
}
