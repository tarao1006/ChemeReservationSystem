import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { PlanSelect } from './PlanSelect'
import { PlanMemo } from './PlanMemo'
export { PlanIcon } from './PlanIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'left',
      overflow: 'hidden',
      flexDirection: 'column',
    },
  }),
)

export const Plan = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <PlanSelect />
      <PlanMemo />
    </div>
  )
}
