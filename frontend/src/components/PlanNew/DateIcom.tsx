import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import ScheduleIcon from '@material-ui/icons/Schedule'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      flex: 'none',
      width: '36px',
      height: '36px',
      color: '#5f6368',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })
)

export const DateIcon = () => {
  const classes = useStyles()

  return (
    <div className={classes.icon}>
      <ScheduleIcon />
    </div>
  )
}