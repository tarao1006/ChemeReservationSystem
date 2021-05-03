import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      whiteSpace: 'nowrap',
      display: 'flex',
      flex: 'none',
      flexDirection: 'column',
    },
    main: {
      minWidth: '64px',
      flex: 1,
      marginLeft: '1px',
    },
  }),
)

export const HeadLeftPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.main} />
    </div>
  )
}
