import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation } from '@api'
import { BodyTitle } from './BodyTitle'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      overflowX: 'hidden',
      overflowY: 'scroll',
      paddingBottom: '16px',
      paddingTop: 0,
    },
    title: {
      minHeight: '32px',
      marginBottom: '12px',
      width: '100%',
      position: 'relative',
      display: 'flex',
      paddingRight: '16px',
      boxSizing: 'border-box',
      alignItems: 'center',
      outline: 'none',
    },
    creator: {

    },
  })
)

export const Body = ({ r }: { r: Reservation }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <BodyTitle r={r} />
      </div>
      <div className={classes.creator}>
      </div>
    </div>
  )
}