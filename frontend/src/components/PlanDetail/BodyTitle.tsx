import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
      fontSize: '14px',
      fontWeight: 400,
      letterSpacing: '.2px',
      lineHeight: '20px',
      color: '#3c4043',
      paddingBottom: '6px',
      paddingTop: '6px',
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    main: {
      lineHeight: 'normal',
      overflow: 'hidden',
    },
    name: {
      lineHeight: '28px',
      fontSize: '22px',
      wordWrap: 'break-word',
      maxHeight: '56px',
    },
    time: {
      lineHeight: '18px',
    },
  })
)

export const BodyTitle = ({ r }: { r: Reservation }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <div className={classes.name}>
          <span>
            {r.plan.name}
          </span>
        </div>
        <div className={classes.time}>
          {r.format()}
        </div>
      </div>
    </div>
  )
}