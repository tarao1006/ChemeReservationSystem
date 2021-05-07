import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // position: 'absolute',
      // top: 0,
      // bottom: 0,
      // left: 0,
      // right: 0,
    },
  }),
)

export const ReservationEdit = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      Edit
    </div>
  )
}
