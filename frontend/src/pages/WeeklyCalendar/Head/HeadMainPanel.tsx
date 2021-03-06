import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { weeklyCalenderHeadHeight } from '@config'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginLeft: '-1px',
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    wrap: {
      height: `${weeklyCalenderHeadHeight}px`,
      display: 'flex',
      flex: 'none',
      overflow: 'hidden',
    },
    main: {
      flex: '1 1 auto',
      display: 'flex',
      overflowX: 'scroll',
      overflowY: 'hidden',
    },
    gutter: {
      width: '9px',
      minWidth: '9px',
    },
    cell: {
      width: '81px',
      minWidth: '81px',
      flex: '1 0 auto',
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
    },
    cellBorder: {
      position: 'absolute',
      marginLeft: '-1px',
      height: '20px',
      borderLeft: '#dadce0 1px solid',
      bottom: 0,
    },
    cellContent: {
      width: '100%',
      margin: 0,
      fontWeight: 400,
      textAlign: 'center',
      display: 'block',
      fontSize: '1.5em',
    },
    text: {
      lineHeight: '32px',
      position: 'relative',
      zIndex: 2,
      color: '#70757a',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '.8px',
      marginLeft: 0,
      marginTop: 0,
      textIndent: '.8px',
      textTransform: 'uppercase',
    },
    textToday: {
      lineHeight: '32px',
      position: 'relative',
      zIndex: 2,
      color: '#1a73e8',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '.8px',
      marginLeft: 0,
      marginTop: 0,
      textIndent: '.8px',
      textTransform: 'uppercase',
    },
    button: {
      height: '40px',
      width: '40px',
    },
    buttonToday: {
      height: '40px',
      width: '40px',
      backgroundColor: '#1a73e8',
      color: 'white',
      '&:hover': {
        backgroundColor: '#1967d2',
      }
    },
    rightGutter: {
      overflow: 'scroll',
      visibility: 'hidden',
      flex: 'none',
      '&::-webkit-scrollbar': {
        width: '8px',
      }
    },
  }),
)

const HeadDay = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()
  const days = ['???', '???', '???', '???', '???', '???', '???']

  return (
    <div className={classes.wrap}>
      <div className={classes.main}>
        <div className={classes.gutter} />
        {dates.map((date, i) => (
          <div key={i} className={classes.cell}>
            <div className={classes.cellBorder} />
            <h2 className={classes.cellContent}>
              <div className={date.isSame(dayjs(), 'day') ? classes.textToday : classes.text}>
                {days[i]}
              </div>
              <IconButton className={date.isSame(dayjs(), 'day') ? classes.buttonToday : classes.button}>
                {date.date()}
              </IconButton>
            </h2>
          </div>
        ))}
      </div>
      <div className={classes.rightGutter}></div>
    </div>
  )
}

export const HeadMainPanel = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <HeadDay dates={dates} />
    </div>
  )
}
