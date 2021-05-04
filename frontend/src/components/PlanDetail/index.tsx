import React from 'react'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import { Reservation } from '@api'

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
      <div>
      </div>
    </Popover>
  )
}
