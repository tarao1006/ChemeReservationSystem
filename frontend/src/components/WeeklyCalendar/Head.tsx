import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      flex: 'none',
      display: 'flex',
    },
    
    headLeftPanel: {
      minWidth: '64px',
    },
    headMainPanel: {
      marginLeft: '-1px',
      position: 'relative',
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    headLeftGutter: {
      width: '8px',
      minWidth: '8px',
    },
    headDayWrap: {
      height: '84px',
      display: 'flex',
      flex: 'none',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    headDay: {
      flex: '1 1 auto',
      display: 'flex',
      overflowX: 'scroll',
      overflowY: 'hidden'
    },
    headDayCell: {
      width: '81px',
      minWidth: '81px',
      flex: '1 0 auto',
      textAlign: 'center',
      display: 'flex',
    },
    headDeyCellBorder: {
      position: 'absolute',
      height: '24px',
      borderLeft: '#dadce0 1px solid',
      bottom: 0,
    },
    headDayCellContent: {
      display: 'block',
      width: '100%',
    },
    headDayText: {
      fontSize: '8px',
      marginTop: theme.spacing(2.0),
    },
    headDayButton: {
      marginTop: theme.spacing(0.5),
      fontSize: '32px',
      height: '48px',
      width: '48px',
    },
  }),
)

const HeadDay = () => {
  const classes = useStyles()
  const days = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className={classes.headDayWrap}>
      <div className={classes.headDay}>
        <div className={classes.headLeftGutter} />
        {days.map((day, i) => (
          <div key={i} className={classes.headDayCell}>
            <div className={classes.headDeyCellBorder} />
            <span className={classes.headDayCellContent}>
              <div className={classes.headDayText}>{day}</div>
              <IconButton className={classes.headDayButton}>
                {i + 4}
              </IconButton>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Head = () => {
  const classes = useStyles()

  return (
    <div className={classes.head}>
      <div className={classes.headLeftPanel} />
      <div className={classes.headMainPanel}>
        <HeadDay />
      </div>
    </div>
  )
}