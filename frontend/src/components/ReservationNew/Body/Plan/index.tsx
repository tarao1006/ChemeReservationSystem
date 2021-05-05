import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { PlanSelect } from './PlanSelect'
import { PlanMemo } from './PlanMemo'
export { PlanIcon } from './PlanIcon'
import {Plan as PlanModel } from '@types'

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

export const Plan = ({
  plan,
  planMemo,
  onPlanChange,
  onPlanMemoChange
}: {
  plan: PlanModel
  planMemo: string
  onPlanChange: (plan: PlanModel) => void
  onPlanMemoChange: (planMemo: string) => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <PlanSelect
        plan={plan}
        onPlanChange={onPlanChange}
      />
      <PlanMemo
        planMemo={planMemo}
        onPlanMemoChange={onPlanMemoChange}
      />
    </div>
  )
}
