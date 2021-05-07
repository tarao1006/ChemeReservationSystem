import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation as ReservationModel, Plan, Facility, User } from '@types'
import {
  AuthContext,
  FacilityContext,
  PlanContext,
} from '@contexts'
import dayjs from 'dayjs'
import { Reservation } from '../Reservation'
import { useReservations } from '@hooks'

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
  const { currentUser } = useContext(AuthContext)
  const { addReservation } = useReservations()
  const { checked } = useContext(FacilityContext)
  const { plans } = useContext(PlanContext)

  const [left, setLeft] = useState<number[]>([])
  const [width, setWidth] = useState<number[]>([])
  const [zIndex, setZIndex] = useState<number[]>([])
  const [maxZIndex, setMaxZIndex] = useState<number>(5)

  useEffect(() => {
    let newLeft = reservations.map(() => 0)
    let newWidth = reservations.map(() => 1)
    let newZIndex = reservations.map(() => BASE_ZINDEX)

    let timeSchedule = new Array<number>(96).fill(-1.0)
    let starts: number[] = []
    let ends: number[] = []

    reservations.forEach(r => {
      const startIndex = getMinute(r.startAt) / 15.0
      const endIndex = getMinute(r.endAt) / 15.0

      starts.push(startIndex)
      ends.push(endIndex)
      for (let i = startIndex; i <= endIndex; ++i) {
        timeSchedule[i]++
      }
    })

    let maxCounts: number[] = []
    reservations.forEach((r, idx) => {
      maxCounts[idx] = Math.max(...timeSchedule.slice(starts[idx], ends[idx] + 1))
    })


    reservations.forEach((_, i) => {
      newZIndex[i] += timeSchedule[starts[i]]
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
    ), false)
  }

  const isIn = (places: Facility[]): boolean => {
    for (const place of places) {
      for (const c of checked) {
        if (place.id === c) {
          return true
        }
      }
    }
    return false
  }

  return (
    <div className={classes.column}>
      <div className={classes.columnContent} onClick={handleClick} />
      <div className={classes.columnContentPresentation}>
        {reservations
          .filter(reservation => (reservation.id === 0) || (reservation.places.length === 0) || isIn(reservation.places))
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
  const { reservations } = useReservations()
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = (e.target as HTMLDivElement).scrollTop
    setScrollTop(top)
  }

  return (
    <div className={classes.root} onScroll={handleScroll}>
      <div className={classes.wrap}>
        <BodyMainPanelContentCell />
        <div className={classes.gutter} />
        {dates.map(date => (
          <BodyMainPanelContentColumn
            key={date.format()}
            reservations={reservations.filter(r => r.startAt.isSame(date, 'day'))}
            date={date}
          />
        ))}
      </div>
    </div>
  )
}
