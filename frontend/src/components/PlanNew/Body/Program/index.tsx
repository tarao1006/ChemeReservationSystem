import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { ProgramSelect } from './ProgramSelect'
import { ProgramMemo } from './ProgramMemo'
import { ProgramIcon } from './ProgramIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
      width: '100%',
      margin: '8px 0 8px',
      fontSize: '14px',
    },
    wrap: {
      display: 'flex',
      margin: '2px 16px 0',
      alignItems: 'flex-start',
    },
    container: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'left',
      overflow: 'hidden',
      flexDirection: 'column',
    },
  }),
)

export const Program = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <ProgramIcon />
        <div className={classes.container}>
          <ProgramSelect />
          <ProgramMemo />
        </div>
      </div>
    </div>
  )
}
