import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Reservation } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
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
  })
)

export const Body = ({ reservation }: { reservation: Reservation }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <TextField
        placeholder="タイトルを追加"
      />
      <Button
        disableRipple
      >
        <span>
          {reservation.formatDate()}
        </span>
        <span>
          {reservation.formatStartAt()}
        </span>
        -
        <span>
          {reservation.formatEndAt()}
        </span>
      </Button>
    </div>
  )
}