import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: '56px',
      height: 'auto',
      flex: 'none',
      display: 'flex',
      alignItems: 'flex-start',
      overflowY: 'hidden',
    },
    main: {
      minWidth: '64px',
      position: 'relative',
      boxSizing: 'border-box',
    },
    cell: {
      height: '48px',
      paddingRight: '8px',
      position: 'relative',
      textAlign: 'right',
    },
    texLabel: {
      display: 'block',
      position: 'relative',
      top: '-6px',
      fontSize: '10px',
      color: '#70757a',
    },
  }),
)

const BodyLeftPanelContent = () => {
  const classes = useStyles()

  const times = [
    '午前12時', '午前1時', '午前2時', '午前3時', '午前4時', '午前5時', '午前6時', '午前7時', '午前8時', '午前9時', '午前10時', '午前11時',
    '午後12時', '午後1時', '午後2時', '午後3時', '午後4時', '午後5時', '午後6時', '午後7時', '午後8時', '午後9時', '午後10時', '午後11時',
  ]

  return (
    <div className={classes.main}>
      {times.map(time => (
        <div key={time} className={classes.cell}>
          <span className={classes.texLabel}>
            {time}
          </span>
        </div>
      ))}
    </div>
  )
}

export const BodyLeftPanel = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <BodyLeftPanelContent />
    </div>
  )
}
