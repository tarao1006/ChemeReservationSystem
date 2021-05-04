import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { getAllReservationsInRange, getAllFacilities } from '@api'
import { Reservation, Facility, inRange } from '@types'
import { AuthContext, ReservationContext } from '@contexts'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 1,
    },
    plans: {
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      height: `75px`,
    },
    plan: {
      width: '100%',
      paddingLeft: theme.spacing(0.4),
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: theme.spacing(0.2),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      display: 'block',
      textAlign: 'left',
    },
    cell: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(2.0),
    },
    button: {
      margin: theme.spacing(1.0),
    },
  }),
)

const formatDate = (date: dayjs.Dayjs): string => {
  return date.format('MM/DD')
}

const formatTime = (date: dayjs.Dayjs): string => {
  return date.format('HH:mm')
}

const formatDay = (date: dayjs.Dayjs): string => {
  return date.format('(dd)')
}

const formatDateAndTime = (date: dayjs.Dayjs): string => {
  return `${formatDate(date)} ${formatDay(date)} ${formatTime(date)}`
}

const formatReservation = (r: Reservation): string => {
  return `${formatTime(r.startAt)} ${r.plan.name} by ${r.creator.name}`
}

const WeeklyCalendarTableHead = ({ dates }: { dates: dayjs.Dayjs[] }) => {

  return (
    <TableHead>
      <TableRow>
        <TableCell></TableCell>
        {dates.map(date => (
          <TableCell key={date.format()} align='center'>
            {date.format('MM/DD (dd)')}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const WeeklyCalendarTableCell = ({ reservations }: { reservations: Reservation[] }) => {
  const classes = useStyles()

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e.target)
  }

  const PlanButton = ({ r }: { r: Reservation }) => (
    <Button key={r.id} color="primary" className={classes.plan} component="span">
      {formatReservation(r)}
    </Button>
  )

  const OtherButton = ({
    r,
    count,
  }: {
    r: Reservation
    count: number
  }) => (
    <Button key={r.id} className={classes.plan} component='span'>
      他{count}件
    </Button>
  )

  return (
    <TableCell onClick={handleClick} className={classes.cell}>
      <div className={classes.plans}>
        {reservations.map((r, i, a) => ((
          i < 2 ? <PlanButton key={i} r={r} />
          : i === 2 ? <OtherButton key={i} r={r} count={a.length - i} />
          : <span key={i} style={{ display: 'hidden' }}></span>
        )))}
      </div>
    </TableCell>
  )
}

const WeeklyCalendarTableBody = ({
  dates,
  facilities,
}: {
  dates: dayjs.Dayjs[]
  facilities: Facility[]
}) => {
  const { reservations } = useContext(ReservationContext)

  return (
    <TableBody>
      {
        facilities.map(facility => (
          <TableRow key={facility.id}>
            <TableCell style={{ whiteSpace: 'nowrap' }}>{facility.name}</TableCell>
            {dates.map(date => {
              return (
                <WeeklyCalendarTableCell
                  key={date.format()}
                  reservations={reservations.filter(
                    r => r.startAt.isSame(date, 'day')
                  ).filter(
                    r => r.facilities.some(f => f.id === facility.id)
                  )}
                />
              )
            })}
          </TableRow>
        ))
      }
    </TableBody>
  )
}

const WeeklyCalendarTable = ({
  dates,
  facilities,
}: {
  dates: dayjs.Dayjs[]
  facilities: Facility[]
}) => {

  return (
    <Table>
      <WeeklyCalendarTableHead dates={dates} />
      <WeeklyCalendarTableBody dates={dates} facilities={facilities} />
    </Table>
  )
}

export const Home = () => {
  const { currentUser } = useContext(AuthContext)
  const { reservations, fetchedDateRange, setReservations, setFetchedDateRange } = useContext(ReservationContext)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [startOfCurrentWeek, setStartOfCurrentWeek] = useState<dayjs.Dayjs>(dayjs())
  const [dates, setDates] = useState<dayjs.Dayjs[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const classes = useStyles()
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
    <>
      <Button onClick={goBackToday} variant="outlined">
        今日
      </Button>
      <IconButton onClick={backDay} size="medium" className={classes.button}>
        <ArrowBackIosIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={forwardDay} size="medium" className={classes.button}>
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
      {isLoading &&<IconButton size="small" disabled disableFocusRipple disableRipple>
        <CircularProgress size={25} />
      </IconButton>}
      <TableContainer>
        <WeeklyCalendarTable dates={dates} facilities={facilities} />
      </TableContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">用途</TableCell>
              <TableCell align="center">使用施設</TableCell>
              <TableCell align="center">作成者</TableCell>
              <TableCell align="center">参加者</TableCell>
              <TableCell align="center">時刻</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.filter(reservation => !reservation.startAt.isBefore(startOfCurrentWeek, 'hour') && !reservation.startAt.isAfter(startOfCurrentWeek.add(7, 'day'), 'hour')).map(reservation => (
                <TableRow key={reservation.id}>
                  <TableCell align="center">{reservation.id}</TableCell>
                  <TableCell align="center">{reservation.plan.name}</TableCell>
                  <TableCell align="center">{reservation.facilities.map(facility => `${facility.name} `)}</TableCell>
                  <TableCell align="center">{reservation.creator.id}</TableCell>
                  <TableCell align="center">{reservation.attendees.map(attendee => `${attendee.name} `)}</TableCell>
                  <TableCell align="center">{formatDateAndTime(reservation.startAt)} - {formatTime(reservation.endAt)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  </>
  )
}
