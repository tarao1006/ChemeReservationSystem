import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { AuthContext, ReservationContext } from '@contexts'
import { getAllReservationsInRange } from '@api'
import { inRange } from '@types'
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
  const { currentUser } = useContext(AuthContext)
  const { reservations, fetchedDateRange, setReservations, setFetchedDateRange } = useContext(ReservationContext)
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

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <Head dates={dates} />
        <Body dates={dates} />
      </div>
    </div>
  )
}
