import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { AuthContext, FacilityContext, ReservationContext, UserContext } from '@contexts'
import { getAllFacilities, getAllReservationsInRange, getAllUsers } from '@api'
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

export const WeeklyCalendar = ({
  isLeftPanelOpen,
  setIsLeftPanelOpen
}: {
  isLeftPanelOpen: boolean
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const { reservations, fetchedDateRange, setReservations, setFetchedDateRange } = useContext(ReservationContext)
  const { setFacilities } = useContext(FacilityContext)
  const { setUsers } = useContext(UserContext)
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

        const u = await getAllUsers()
        setUsers(u)

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
      {/* <div className={classes.buttons}>
        <Button onClick={goBackToday} variant="outlined">
          今日
        </Button>
        <IconButton onClick={backDay} size="medium" className={classes.button}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <IconButton onClick={forwardDay} size="medium" className={classes.button}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
        {isLoading && (
          <IconButton size="small" disabled disableFocusRipple disableRipple>
            <CircularProgress size={25} />
          </IconButton>
        )}
      </div> */}
      <div className={classes.wrap}>
        <Head dates={dates} />
        <Body dates={dates} />
      </div>
    </div>
  )
}
