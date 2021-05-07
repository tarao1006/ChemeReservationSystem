import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Plan } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
    },
  }),
)

export const PlanMemo = ({
  planMemo,
  onPlanMemoChange
}: {
  planMemo: string
  onPlanMemoChange: (planMemo: string) => void
}) => {
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPlanMemoChange(e.target.value)
  }

  return (
    <TextField
      value={planMemo}
      onChange={handleChange}
      className={classes.root}
      placeholder="メモを追加"
    />
  )
}
