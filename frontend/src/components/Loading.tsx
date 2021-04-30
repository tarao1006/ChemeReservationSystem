import React from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
)

export const Loading = ({ isLoading }) => {
  const classes = useStyles()

  return (
    <Backdrop classes={{ root: classes.root }} open={isLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
