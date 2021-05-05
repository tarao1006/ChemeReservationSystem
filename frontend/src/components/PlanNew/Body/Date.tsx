import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { DatePicker } from '@material-ui/pickers';
import { DateIcon } from './DateIcon'
import { Reservation } from '@types'
import dayjs from 'dayjs'

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
      flex: 'none',
      height: '24px',
      marginRight: '6px',
      fontSize: '14px',
      textAlign: 'left',
    },
    timeSelect: {
      width: '64px',
      height: '24px',
      flex: '1 1 auto',
      margin: '0 6px',
      fontSize: '14px',
    },
    selectItem: {
      minWidth: '150px',
      fontSize: '14px',
      lineHeight: '40px',
      padding: '2px 16px',
    },
  })
)

const paddingMinute = (minute: number) => {
  if (minute < 10) {
    return `0${minute}`
  } else {
    return `${minute}`
  }
}

const parseMinute = (minutes: number) => {
  if (minutes >= 24 * 60) {
    minutes -= 24 * 60
  }
  const A = (minutes < 12 * 60) ? '午前' : '午後'
  let hour = Math.floor(minutes / 60.0)
  const minute = minutes - hour * 60
  if (hour === 0) {
    hour = 12
  } else if (hour >= 13) {
    hour -= 12
  }

  return `${A}${hour}:${paddingMinute(minute)}`
}

const parseMinuteWithN = (minutes: number, base: number) => {
  const gapMinute = minutes - base
  const gapHour = gapMinute / 60.0
  const gapText = (gapHour < 1) ? `${gapMinute}分` : `${gapHour}時間`
  const parsedMinute = parseMinute(minutes)

  return `${parsedMinute} (${gapText})`
}

export const Date = ({
  reservation,
  onDateChange,
  onStartAtChange,
  onEndAtChange
}: {
  reservation: Reservation
  onDateChange: (date: dayjs.Dayjs) => void
  onStartAtChange: (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => void
  onEndAtChange: (endAt: dayjs.Dayjs) => void
}) => {
  const classes = useStyles()
  const [date, setDate] = useState<dayjs.Dayjs>(reservation.startAt.startOf('day'))
  const [startAtMinute, setStartAtMinute] = useState<number>(reservation.startAt.hour() * 60 + reservation.startAt.minute())
  const [endAtMinute, setEndAtMinute] = useState<number>(reservation.endAt.hour() * 60 + reservation.endAt.minute())

  const startAtSelect = new Array<number>(4 * 24).fill(0).map((m, i) => m + i * 15)
  const endAtSelect = new Array<number>(4 * 24 - 1).fill(startAtMinute).map((m, i) => m + i * 15).filter((m, i) => i <= 4 || i % 2 === 0)
  const gapMinute = endAtMinute - startAtMinute

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setDate(date)
    onDateChange(date)
  }

  const handleStartAtChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newStartAtMinute = e.target.value as number
    setStartAtMinute(newStartAtMinute)
    setEndAtMinute(newStartAtMinute + gapMinute)

    onStartAtChange(date.add(newStartAtMinute, 'minute'), date.add(newStartAtMinute + gapMinute, 'minute'))
  }

  const handleEndAtChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const newEndAtMinute = e.target.value as number
    setEndAtMinute(e.target.value as number)
    onEndAtChange(date.add(newEndAtMinute, 'minute'))
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <DateIcon />
        <div className={classes.container}>
          <div className={classes.main}>
              <DatePicker
                disableToolbar
                variant="inline"
                format="M[月] D[日] (dddd)"
                margin="normal"
                value={date}
                onChange={handleDateChange}
                InputProps={{
                  classes: {
                    root: classes.dateSelect
                  },
                  style: {
                    width: `${103 + (date.date() >= 10 ? 8 : 0) + (date.month() + 1 >= 10 ? 8 : 0)}px`,
                  }
                }}
              />
            <div className={classes.time}>
              <Select
                value={startAtMinute}
                renderValue={(value: number) => parseMinute(value)}
                onChange={handleStartAtChange}
                className={classes.timeSelect}
                MenuProps={{
                  style: {
                    maxHeight: '400px',
                  }
                }}
                inputProps={{
                  fontSize: '14px',
                }}
              >
                {startAtSelect.map(s => (
                  <MenuItem
                    key={parseMinute(s)}
                    value={s}
                    className={classes.selectItem}
                  >
                    {parseMinute(s)}
                  </MenuItem>
                ))}
              </Select>
              <span style={{ fontSize: '14px' }}>–</span>
              <Select
                value={endAtMinute}
                renderValue={(value: number) => parseMinute(value)}
                onChange={handleEndAtChange}
                className={classes.timeSelect}
                MenuProps={{
                  style: {
                    maxHeight: '400px',
                  }
                }}
                inputProps={{
                  fontSize: '14px',
                }}
              >
                {endAtSelect.map(s => (
                  <MenuItem
                    key={parseMinute(s)}
                    value={s}
                    className={classes.selectItem}
                  >
                    {parseMinuteWithN(s, startAtMinute)}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}