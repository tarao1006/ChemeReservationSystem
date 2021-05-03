import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { AuthContext, ReservationContext } from '@contexts'
import { Facility, getAllFacilities, getAllReservationsInRange, inRange } from '@api'
import { Head } from './Head'
import { Body } from './Body'
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
  }),
)

export const WeeklyCalendar = () => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const { reservations, fetchedDateRange, setReservations, setFetchedDateRange } = useContext(ReservationContext)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [startOfCurrentWeek, setStartOfCurrentWeek] = useState<dayjs.Dayjs>(dayjs())
  const [dates, setDates] = useState<dayjs.Dayjs[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    const fetch = async () => {
      if (currentUser) {
        const d = dayjs(params["date"]).startOf('day')
        const s = d.add(-d.day(), 'day')
        setStartOfCurrentWeek(s)
        setDates(new Array<dayjs.Dayjs>(7).fill(s).map((d, i) => d.add(i, 'day')))

        const f = await getAllFacilities()
        setFacilities(f)

        if (reservations.length === 0 || !inRange(fetchedDateRange, d)) {
          if (reservations.length === 0) {
            setIsLoading(true)
          }
          const targetDateRange = {
            from: d.add(-3, 'month').format('YYYY-MM-DD'),
            to: d.add(3, 'month').format('YYYY-MM-DD'),
          }
          const r = await getAllReservationsInRange(targetDateRange)
          setFetchedDateRange(targetDateRange)
          r.sort((l, r) => {
            if (l.startAt.isAfter(r.startAt)) return 1
            else return -1
          })
          setReservations(r)
        }
      }
      setIsLoading(false)
    }
    fetch()
  }, [params]);

  const forwardDay = () => {
    history.push(`/calendar/week/${startOfCurrentWeek.add(7, 'day').format('YYYY-MM-DD')}`)
  }

  const backDay = () => {
    history.push(`/calendar/week/${startOfCurrentWeek.add(-7, 'day').format('YYYY-MM-DD')}`)
  }

  const goBackToday = () => {
    history.push(`/calendar/week/${dayjs().format('YYYY-MM-DD')}`)
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <Head dates={dates} />
        <Body />
      </div>
    </div>
  )
}
