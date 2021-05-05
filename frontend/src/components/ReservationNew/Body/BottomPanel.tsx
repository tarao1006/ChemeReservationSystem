import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 'none',
      padding: '8px 16px 0',
      display: 'flex',
      flexDirection: 'row-reverse',
    },
  }),
)

export const BottomPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Button color="primary" variant="contained" type="submit">
        保存
      </Button>
    </div>
  )
}