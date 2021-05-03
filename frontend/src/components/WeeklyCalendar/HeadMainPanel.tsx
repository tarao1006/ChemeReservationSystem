import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

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
      height: '84px',
      display: 'flex',
      flex: 'none',
      overflow: 'hidden',
    },
    main: {
      flex: '1 1 auto',
      display: 'flex',
      overflowX: 'scroll',
      overflowY: 'hidden'
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
      marginTop: '8px',
      textIndent: '.8px',
      textTransform: 'uppercase',
    },
    button: {
      height: '46px',
      width: '46px',
    },
  }),
)

const HeadDay = () => {
  const classes = useStyles()
  const days = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className={classes.wrap}>
      <div className={classes.main}>
        <div className={classes.gutter} />
        {days.map((day, i) => (
          <div key={i} className={classes.cell}>
            <div className={classes.cellBorder} />
            <h2 className={classes.cellContent}>
              <div className={classes.text}>
                {day}
              </div>
              <IconButton className={classes.button}>
                {i + 8}
              </IconButton>
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export const HeadMainPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <HeadDay />
      <div></div> {/* sZR1Lb  */}
    </div>
  )
}
