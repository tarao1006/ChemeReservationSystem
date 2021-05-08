import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { inRange } from '@types'
import { useReservations } from '@hooks'
import { Head } from './Head'
import { Body } from './Body'
import { useAuth, useUsers, usePlans, useFacilities } from '@hooks'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      display: 'block',
    },
    wrap: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    buttons: {
      height: '36px',
      marginLeft: '64px',
      marginTop: '12px',
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      flex: 'none',
      margin: theme.spacing(1.0),
    },
  }),
)

export const WeeklyCalendar = () => {
  const classes = useStyles()
  const { currentUser } = useAuth()
  const { reservations, initReservations, fetchedDateRange } = useReservations()
  const [dates, setDates] = useState<dayjs.Dayjs[]>([])
  const params = useParams()
  const { initFacilities } = useFacilities()
  const { initUsers } = useUsers()
  const { initPlans } = usePlans()

  const getResources = async () => {
    initFacilities()
    initUsers()
    initPlans()
  }

  useEffect(() => {
    getResources()
  }, [currentUser])

  useEffect(() => {
    const fetch = async () => {
      if (currentUser) {
        const d = dayjs(params["date"]).startOf('day')
        const s = d.add(-d.day(), 'day')
        setDates(new Array<dayjs.Dayjs>(7).fill(s).map((d, i) => d.add(i, 'day')))

        if (reservations.length === 0 || !inRange(fetchedDateRange, d)) {
          await initReservations({
            from: d.add(-6, 'month').format('YYYY-MM-DD'),
            to: d.add(6, 'month').format('YYYY-MM-DD'),
          })
        }
      }
    }
    fetch()
  }, [params]);

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <Head dates={dates} />
        <Body dates={dates} />
      </div>
    </div>
  )
}
