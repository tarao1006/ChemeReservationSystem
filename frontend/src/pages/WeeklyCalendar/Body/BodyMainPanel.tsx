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

const BodyMainPanelContentColumn = ({
  date
}: {
  date: dayjs.Dayjs
}) => {
  const classes = useStyles()
  const { currentUser } = useContext(AuthContext)
  const {
    reservations,
    addReservation
  } = useReservations()
  const { checked } = useContext(FacilityContext)
  const { plans } = useContext(PlanContext)

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
          .filter(reservation => reservation.startAt.isSame(date, 'day'))
          .filter(reservation => (reservation.id === 0) || (reservation.places.length === 0) || isIn(reservation.places))
          .map(reservation => (
            <Reservation
              key={reservation.id}
              reservation={reservation}
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
            date={date}
          />
        ))}
      </div>
    </div>
  )
}
