import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Title } from './Title'
import { Date } from './Date'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      overflowX: 'hidden',
      overflowY: 'scroll',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
)

export const MainPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Title />
      <Date />
    </div>
  )
}