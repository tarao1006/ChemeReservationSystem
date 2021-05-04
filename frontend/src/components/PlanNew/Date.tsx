import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { DateIcon } from './DateIcom'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'table',
      width: '100%',
      margin: '16px 0 20px',
      fontSize: '14px',
    },
    wrap: {
      display: 'flex',
      margin: '2px 16px 0',
      alignItems: 'center',
    },
    field: {
      display: 'table',
      width: '100%',
      margin: '16px 0 20px',
      fontSize: '14px',
    },
    icon: {
      flex: 'none',
    },
    container: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    },
    main: {
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      textAlign: 'left',
      flex: '1 1 auto',
    },
    time: {
      flex: '1 1 auto',
      display: 'flex',
      padding: '0 8px',
    },
    dateSelect: {
      width: '100px',
      margin: '0 8px',
    },
    timeSelect: {
      width: '64px',
      flex: '1 1 auto',
      margin: '0 8px',
    }
  })
)

export const Date = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <DateIcon />
        <div className={classes.container}>
          <div className={classes.main}>
            <Select className={classes.dateSelect}>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <div className={classes.time}>
              <Select className={classes.timeSelect}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <span style={{ fontSize: '14px' }}>–</span>
              <Select className={classes.timeSelect}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}