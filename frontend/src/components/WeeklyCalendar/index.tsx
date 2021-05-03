import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Head } from './Head'
import { Body } from './Body'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'block',
    },
    wrap: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  }),
)

export const WeeklyCalendar = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <Head />
        <Body />
      </div>
    </div>
  )
}
