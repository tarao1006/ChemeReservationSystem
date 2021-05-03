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
    table: {
      minWidth: '56px',
      position: 'absolute',
      left: 0,
      top: 0,
      display: 'table',
    },
    label: {
      zIndex: 1,
      top: '84px',
      boxSizing: 'border-box',
      display: 'table-cell',
      lineHeight: '24px',
      minHeight: '24px',
      overflow: 'hidden',
      position: 'relative',
      textAlign: 'center',
      verticalAlign: 'middle',
      backgroundColor: '#fafafa',
    },
    timeZone: {
      color: '#70757a',
      fontSize: '10px',
      height: '20px',
      lineHeight: '20px',
      marginLeft: 'auto',
      maxWidth: '80px',
      minWidth: '40px',
      overflow: 'hidden',
      textAlign: 'right',
    },
  }),
)

export const HeadLeftPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.main} />
      <div className={classes.table}>
        <div className={classes.label}>
          <div className={classes.timeZone}>
            GMT+09
          </div>
        </div>
      </div>
    </div>
  )
}
