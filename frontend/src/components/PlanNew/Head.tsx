import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row-reverse',
      height: '36px',
      overflow: 'hidden',
    },
  })
)

export const Head = ({
  handleClose,
}: {
  handleClose: () => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <IconButton size='small' onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </div>
  )
}