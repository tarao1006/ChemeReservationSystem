import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { HeadLeftPanel } from './HeadLeftPanel'
import { HeadMainPanel } from './HeadMainPanel'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 'none',
      display: 'flex',
    },
  }),
)

export const Head = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <HeadLeftPanel />
      <HeadMainPanel dates={dates} />
    </div>
  )
}