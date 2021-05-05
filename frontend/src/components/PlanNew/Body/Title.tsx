import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 'auto',
      margin: '0 16px',
      padding: '8px 0 0 36px',
      boxSizing: 'border-box',
    },
  }),
)

export const Title = () => {
  const classes = useStyles()

  return (
    <TextField
      className={classes.root}
      placeholder="タイトルを追加"
    />
  )
}
