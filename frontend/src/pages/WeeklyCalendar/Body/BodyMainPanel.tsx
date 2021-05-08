import React, { useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import { Reservation as ReservationModel, Facility, User } from '@types'
import dayjs from 'dayjs'
import { Reservation } from '../Reservation'
import { useReservations, useAuth, usePlans, useFacilities, useUsers } from '@hooks'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflowX: 'auto',
      overflowY: 'scroll',
      display: 'flex',
      alignItems: 'flex-start',
      flex: '1 1 auto'
    },
    wrap: {
      minWidth: '100%',
      flex: 'none',
      display: 'inline-flex',
      verticalAlign: 'top',
      overflow: 'hidden',
      position: 'relative',
    },
    hiddenColumn: {
      borderTop: '#dadce0 1px solid',
    },
    hiddenColumnCell: {
      height: '48px',
      '&::after': {
        zIndex: 3,
        content: "''",
        position: 'absolute',
        width: '100%',
        marginTop: '-1px',
        borderBottom: '#dadce0 1px solid',
      }
    },
    gutter: {
      width: '9px',
      borderRight: '#dadce0 1px solid',
    },
    column: {
      width: '81px',
      minWidth: '81px',
      flex: '1 0 auto',
      borderRight: '#dadce0 1px solid',
      position: 'relative',
      paddingRight: '12px',
      boxSizing: 'border-box',
      outline: 'none',
    },
    columnContent: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 5,
    },
    columnContentPresentation: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
  }),
)

const BodyMainPanelContentCell = () => {
  const classes = useStyles()

  const times = [
    '午前12時', '午前1時', '午前2時', '午前3時', '午前4時', '午前5時', '午前6時', '午前7時', '午前8時', '午前9時', '午前10時', '午前11時',
    '午後12時', '午後1時', '午後2時', '午後3時', '午後4時', '午後5時', '午後6時', '午後7時', '午後8時', '午後9時', '午後10時', '午後11時',
  ]

  return (
    <div className={classes.hiddenColumn}>
      {times.map(time => (
        <div key={time} className={classes.hiddenColumnCell} />
      ))}
    </div>
  )
}

const BASE_ZINDEX = 5 as const

const getMinute = (day: dayjs.Dayjs): number => {
  return day.hour() * 60 + day.minute()
} 

const BodyMainPanelContentColumn = ({
  reservations,
  date
}: {
  reservations: ReservationModel[]
  date: dayjs.Dayjs
}) => {
  const classes = useStyles()
  const { currentUser } = useAuth()
  const { addReservation } = useReservations()
  const { plans } = usePlans()

  const [left, setLeft] = useState<number[]>([])
  const [width, setWidth] = useState<number[]>([])
  const [zIndex, setZIndex] = useState<number[]>([])
  const [maxZIndex, setMaxZIndex] = useState<number>(BASE_ZINDEX)

  useEffect(() => {
    let newLeft = reservations.map(() => 0)
    let newWidth = reservations.map(() => 1)
    let newZIndex = reservations.map(() => BASE_ZINDEX)

    let timeSchedule = new Array<number>(96).fill(0.0)
    let starts: number[] = []
    let ends: number[] = []

    reservations.forEach(r => {
      starts.push(getMinute(r.startAt) / 15.0)
      ends.push(getMinute(r.endAt) / 15.0)
    })

    reservations.forEach((_, i) => {
      timeSchedule[starts[i]]++
      timeSchedule[ends[i]]--
    })

    for (let i = 1; i < timeSchedule.length; ++i) {
      timeSchedule[i] += timeSchedule[i - 1]
    }

    let maxCounts: number[] = []
    reservations.forEach((r, idx) => {
      maxCounts[idx] = Math.max(...timeSchedule.slice(starts[idx], ends[idx] + 1))
    })

    reservations.forEach((_, i) => {
      newZIndex[i] += timeSchedule[starts[i]] - 1
    })

    reservations.forEach((r, i) => {
      const zIndex = newZIndex[i]
      const maxCount = maxCounts[i]

      newWidth[i] -= (maxCount - 1) * 0.05
      newLeft[i] += (zIndex - BASE_ZINDEX) * 0.05
    })

    setMaxZIndex(BASE_ZINDEX + Math.max(...timeSchedule))
    setLeft(newLeft)
    setWidth(newWidth)
    setZIndex(newZIndex)
  }, [reservations])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetY = e.nativeEvent.offsetY
    const offsetAllMinutes = Math.floor(offsetY / 12.0) * 15
    const offsetHour = Math.floor(offsetAllMinutes / 60.0)
    const offsetMinutes = offsetAllMinutes - offsetHour * 60.0
    const startAt = date.hour(offsetHour).minute(offsetMinutes)
    const endAt = date.hour(offsetHour).minute(offsetMinutes).add(1, 'hour')
    const now = dayjs()

    addReservation(new ReservationModel(
      0,
      currentUser,
      startAt,
      endAt,
      plans[0],
      '',
      now,
      now,
      [],
      [],
    ))
  }

  return (
    <div className={classes.column}>
      <div className={classes.columnContent} onClick={handleClick} />
      <div className={classes.columnContentPresentation}>
        {reservations
          .map((reservation, i) => (
            <Reservation
              key={reservation.id}
              reservation={reservation}
              left={left[i]}
              width={width[i]}
              zIndex={zIndex[i]}
              maxZIndex={maxZIndex}
            />
          )
        )}
      </div>
    </div>
  )
}

export const BodyMainPanel = ({
  dates,
  setScrollTop
}: {
  dates: dayjs.Dayjs[]
  setScrollTop(scrollTop: number): void
}) => {
  const classes = useStyles()
  const { reservations, status, resetStatus } = useReservations()
  const facilitiesState = useFacilities()
  const facilitiesChecked = facilitiesState.checked
  const usersState = useUsers()
  const usersChecked = usersState.checked

  const [savedSnackbarOpen, setSavedSnackbarOpen] = useState<boolean>(false)
  const [deletedSnackbarOpen, setDeletedSnackbarOpen] = useState<boolean>(false)

  useEffect(() => {
    setSavedSnackbarOpen(status === 'created' || status === 'updated')
    setDeletedSnackbarOpen(status === 'deleted')
  }, [status])

  const handleSavedSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSavedSnackbarOpen(false)
    resetStatus()
  }

  const handleDeletedSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeletedSnackbarOpen(false)
    resetStatus()
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = (e.target as HTMLDivElement).scrollTop
    setScrollTop(top)
  }

  const isInFacility = (places: Facility[]): boolean => {
    for (const place of places) {
      for (const c of facilitiesChecked) {
        if (place.id === c) {
          return true
        }
      }
    }
    return false
  }

  const isInUser = (attendees: User[]): boolean => {
    for (const attendee of attendees) {
      for (const c of usersChecked) {
        if (attendee.id === c) {
          return true
        }
      }
    }
    return false
  }

  return (
    <>
      <div className={classes.root} onScroll={handleScroll}>
        <div className={classes.wrap}>
          <BodyMainPanelContentCell />
          <div className={classes.gutter} />
          {dates.map(date => (
            <BodyMainPanelContentColumn
              key={date.format()}
              reservations={
                reservations
                  .filter(r => r.startAt.isSame(date, 'day'))
                  .filter(reservation => 
                    (reservation.id === 0) ||
                    (reservation.places.length === 0) ||
                    isInFacility(reservation.places))
                  .filter(reservation => 
                    (reservation.id === 0) ||
                    (reservation.attendees.length === 0) ||
                    isInUser(reservation.attendees))
              }
              date={date}
            />
          ))}
        </div>
      </div>
      <Snackbar
        open={savedSnackbarOpen}
        message={"予定を保存しました"}
        autoHideDuration={6000}
        onClose={handleSavedSnackbarClose}
        action={
          <IconButton size="small" onClick={handleSavedSnackbarClose} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      <Snackbar
        open={deletedSnackbarOpen}
        message={"予定を削除しました"}
        autoHideDuration={6000}
        onClose={handleDeletedSnackbarClose}
        action={
          <IconButton size="small" onClick={handleDeletedSnackbarClose} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  )
}
