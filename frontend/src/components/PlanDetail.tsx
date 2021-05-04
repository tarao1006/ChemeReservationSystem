import React, { useEffect, useState } from 'react'
import Popover, { PopoverOrigin } from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    backDropRoot: {
      backgroundColor: 'transparent',
    }
  }),
)

export const PlanDetail = ({
  isOpen,
  onClose,
  anchorEl,
  anchorOrigin,
  transformOrigin
}: {
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
      <Typography>The content of the Popover.</Typography>
    </Popover>
  )
}
