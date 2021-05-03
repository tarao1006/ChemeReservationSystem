import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { BodyLeftPanel } from './BodyLeftPanel'
import { BodyMainPanel } from './BodyMainPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 60%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    wrap: {
      flex: '1 1 auto',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
    },
  }),
)

export const Body = () => {
  const classes = useStyles()
  const [scrollTop, setScrollTop] = useState<number>(0)

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <BodyLeftPanel scrollTop={scrollTop} />
        <BodyMainPanel setScrollTop={setScrollTop} />
      </div>
    </div>
  )
}
