import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      flex: '1 1 60%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },

    bodyContent: {
      flex: '1 1 auto',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
    },
    bodyLeftPanel: {
      minWidth: '56px',
      height: 'auto',
      flex: 'none',
      display: 'flex',
      alignItems: 'flex-start',
      overflowY: 'hidden',
    },
    bodyLeftPanelContent: {
      minWidth: '64px',
      position: 'relative',
      boxSizing: 'border-box',
    },
    bodyLeftPanelCell: {
      height: '48px',
      paddingRight: '8px',
      position: 'relative',
      textAlign: 'right',
    },
    bodyLeftPanelCellTextLabel: {
      display: 'block',
      position: 'relative',
      top: '-6px',
      fontSize: '10px',
      color: '#70757a',
    },

    bodyMainPanel: {
      overflowX: 'auto',
      overflowY: 'scroll',
      display: 'flex',
      alignItems: 'flex-start',
      flex: '1 1 auto'
    },
    bodyMainPanelContent: {
      minWidth: '100%',
      flex: 'none',
      display: 'inline-flex',
      verticalAlign: 'top',
      overflow: 'hidden',
      position: 'relative',
    },
    bodyLeftGutter: {
      width: '8px',
      borderRight: '#dadce0 1px solid',
    },
    bodyMainPanelColumn: {
      width: '81px',
      minWidth: '81px',
      flex: '1 0 auto',
      borderRight: '#dadce0 1px solid',
      position: 'relative',
      paddingRight: '12px',
      boxSizing: 'border-box',
    },
    bodyMainPanelColumnContent: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    bodyMainPanelColumnContentPresentation: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    bodyMainPanelHiddenColumn: {
      borderTop: '#dadce0 1px solid',
    },
    bodyMainPanelHiddenColumnCell: {
      height: '48px',
      '&::after': {
        zIndex: 3,
        content: "''",
        position: 'absolute',
        width: '100%',
        marginTop: '-1px',
        borderBottom: '#dadce0 1px solid',
      }
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
    <div className={classes.bodyLeftPanelContent}>
      {times.map(time => (
        <div key={time} className={classes.bodyLeftPanelCell}>
          <span className={classes.bodyLeftPanelCellTextLabel}>
            {time}
          </span>
        </div>
      ))}
    </div>
  )
}

const BodyMainPanelContentCell = () => {
  const classes = useStyles()

  const times = [
    '午前12時', '午前1時', '午前2時', '午前3時', '午前4時', '午前5時', '午前6時', '午前7時', '午前8時', '午前9時', '午前10時', '午前11時',
    '午後12時', '午後1時', '午後2時', '午後3時', '午後4時', '午後5時', '午後6時', '午後7時', '午後8時', '午後9時', '午後10時', '午後11時',
  ]

  return (
    <div className={classes.bodyMainPanelHiddenColumn}>
      {times.map(time => (
        <div key={time} className={classes.bodyMainPanelHiddenColumnCell}>
        </div>
      ))}
    </div>
  )
}

const BodyMainPanelContent = () => {
  const classes = useStyles()
  const days = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className={classes.bodyMainPanelContent}>
      <BodyMainPanelContentCell />
      <div className={classes.bodyLeftGutter} />
      {days.map(day => (
        <div key={day} className={classes.bodyMainPanelColumn}>
          {/* <div className={classes.bodyMainPanelColumnContent} /> */}
          {/* <div className={classes.bodyMainPanelColumnContentPresentation} /> */}
        </div>
      ))}
    </div>
  )
}

export const Body = () => {
  const classes = useStyles()

  return (
    <div className={classes.body}>
      <div className={classes.bodyContent}>
        <div className={classes.bodyLeftPanel}>
          <BodyLeftPanelContent />
        </div>
        <div className={classes.bodyMainPanel}>
          <BodyMainPanelContent />
        </div>
      </div>
    </div>
  )
}
