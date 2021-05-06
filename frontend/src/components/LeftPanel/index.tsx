import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    leftPanel: {
      width: '256px',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0s'
    },
  }),
)

export const LeftPanel = ({
  isOpen
}: {
  isOpen: boolean
}) => {
  const classes = useStyles()

  return (
    <div
      className={classes.leftPanel}
      style={{
        marginLeft: isOpen ? '0px' : '-256px',
      }}
    >
      Left panel
    </div>
  )
}
