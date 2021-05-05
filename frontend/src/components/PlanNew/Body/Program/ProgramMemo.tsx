import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
  }),
)

export const ProgramMemo = () => {
  const classes = useStyles()

  return (
    <TextField
      className={classes.root}
      placeholder="メモを追加"
    />
  )
}
