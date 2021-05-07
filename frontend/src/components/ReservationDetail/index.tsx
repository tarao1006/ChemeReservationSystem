import React, { useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Head } from './Head'
import { Body } from './Body'
import { Reservation } from '@types'
import { useReservations } from '@hooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '448px',
      maxWidth: '448px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }
  })
)

export const ReservationDetail = ({
  reservation,
  isOpen,
  onClose,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  margin,
}: {
  reservation: Reservation
  isOpen: boolean
  onClose: () => void
  anchorEl: Element
  anchorOrigin: PopoverOrigin
  transformOrigin: PopoverOrigin
  margin: {
    top: string
    left: string
  } 
}) => {
  const classes = useStyles()
  const { deleteReservation } = useReservations()
  const history = useHistory()
  const location = useLocation()

  const handleClose = () => {
    onClose()
  }

  const handleEdit = () => {
    history.push({
      pathname: `/calendar/reservationedit/${reservation.id}`,
      state: {
        from: location.pathname,
      }
    })
  }

  const handleDelete = () => {
    deleteReservation(reservation, true)
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
        <Head
          reservation={reservation}
          onClose={handleClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <Body reservation={reservation} />
      </div>
    </Popover>
  )
}
