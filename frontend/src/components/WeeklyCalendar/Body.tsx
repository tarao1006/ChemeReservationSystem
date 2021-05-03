import React, { useRef, useState } from 'react'
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
        boxShadow: 'inset 0px 1px 1px 0 #dadce0',
        content: "''",
        height: '4px',
        position: 'absolute',
        width: '100%',
        zIndex: 505,
      },
    }
  }),
)

export const Body = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()
  const [scrolled, setScrolled] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(undefined)

  const setScrollTop = (scrollTop: number) => {
    ref.current.scrollTop = scrollTop
    setScrolled(scrollTop !== 0)
  }

  return (
    <div className={classes.root}>
      <div className={scrolled ? classes.wrapScrolled : classes.wrap}>
        <BodyLeftPanel ref={ref} />
        <BodyMainPanel dates={dates} setScrollTop={setScrollTop} />
      </div>
    </div>
  )
}
