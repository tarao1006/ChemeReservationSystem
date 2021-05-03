import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { BodyLeftPanel } from './BodyLeftPanel'
import { BodyMainPanel } from './BodyMainPanel'
import dayjs from 'dayjs'

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
    wrapScrolled: {
      flex: '1 1 auto',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      '&::before': {
        boxShadow: 'inset 0 1px 1px 0 rgb(0 0 0 / 14%), inset 0 2px 1px -1px rgb(0 0 0 / 12%)',
        content: "''",
        height: '4px',
        position: 'absolute',
        width: '100%',
      },
    }
  }),
)

export const Body = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()
  const [scrollTop, setScrollTop] = useState<number>(0)

  return (
    <div className={classes.root}>
      <div className={scrollTop === 0 ? classes.wrap : classes.wrapScrolled}>
        <BodyLeftPanel scrollTop={scrollTop} />
        <BodyMainPanel dates={dates} setScrollTop={setScrollTop} />
      </div>
    </div>
  )
}
