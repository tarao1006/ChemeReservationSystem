import React from 'react'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Head } from './Head'
import { Body } from './Body'
import { Reservation } from '@api'

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

export const PlanDetail = ({
  r,
  isOpen,
  onClose,
  anchorEl,
  anchorOrigin,
  transformOrigin
}: {
  r: Reservation
  isOpen: boolean
  onClose: () => void
  anchorEl: Element
  anchorOrigin: PopoverOrigin
  transformOrigin: PopoverOrigin
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
    >
      <div className={classes.root}>
        <Head />
        <Body r={r} />
      </div>
    </Popover>
  )
}
