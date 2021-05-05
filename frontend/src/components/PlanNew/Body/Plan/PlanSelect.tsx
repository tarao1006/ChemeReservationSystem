import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Plan } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    select: {
      // width: 'auto',
      // marginRight: '16px',
      // marginLeft: '52px',
      // paddingTop: '8px',
      // boxSizing: 'border-box',
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

export const PlanSelect = () => {
  const classes = useStyles()
  const [plan, setPlan] = useState<Plan>(plans[0])

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPlan(plans.find(p => p.name === e.target.value as string))
  }

  return (
    <Select
      value={plan.name}
      onChange={handleChange}
      className={classes.select}
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
