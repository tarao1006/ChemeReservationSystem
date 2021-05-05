import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Plan } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
  }),
)

const plans: Plan[] = [
  {
    id: 1,
    name: '会議',
  },
  {
    id: 2,
    name: 'ゼミ',
  }
]

export const PlanSelect = ({
  plan,
  onPlanChange
}: {
  plan: Plan,
  onPlanChange: (plan: Plan) => void
}) => {
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    onPlanChange(plans.find(p => p.name === e.target.value as string))
  }

  return (
    <Select
      value={plan.name}
      onChange={handleChange}
      className={classes.root}
    >
      {plans.map(plan => (
        <MenuItem
          value={plan.name}
          key={plan.id}
        >
          {plan.name}
        </MenuItem>
      ))}
    </Select>
  )
}
