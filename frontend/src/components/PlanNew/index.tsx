import React from 'react'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Head } from './Head'
import { Body } from './Body'
import { Reservation } from '@types'

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

export const PlanNew = ({
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

  const handleClose = () => {
    onClose()
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleDelete = () => {
    console.log('delete')
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
        <Body reservation={reservation} />
      </div>
    </Popover>
  )
}
