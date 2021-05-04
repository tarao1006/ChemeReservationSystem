import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Reservation } from '@api'
import { AuthContext, ReservationContext } from '@contexts'
import dayjs from 'dayjs'
import { Plan } from './Plan'

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
  date,
  reservations
}: {
  date: dayjs.Dayjs
  reservations: Reservation[]
}) => {
  const { currentUser } = useContext(AuthContext)
  const classes = useStyles()
  const [newReservation, setNewReservation] = useState<Reservation>()

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const offsetY = e.nativeEvent.offsetY
    const offsetAllMinutes = Math.floor(offsetY / 12.0) * 15
    const offsetHour = Math.floor(offsetAllMinutes / 60.0)
    const offsetMinutes = offsetAllMinutes - offsetHour * 60.0

    setNewReservation(new Reservation(
      0,
      currentUser,
      date.hour(offsetHour).minute(offsetMinutes),
      date.hour(offsetHour).minute(offsetMinutes).add(1, 'hour'),
      {
        id: 0,
        name: 'テスト'
      },
      '',
      dayjs(),
      dayjs(),
      [],
      []
    ))
  }

  return (
    <div className={classes.column}>
      <div className={classes.columnContent} onClick={handleClick} />
      <div className={classes.columnContentPresentation}>
        {reservations.map(r => <Plan key={r.id} r={r} />)}
        {newReservation !== undefined && <Plan r={newReservation} />}
      </div>
    </div>
  )
}

const BodyMainPanelContent = ({ dates }: { dates: dayjs.Dayjs[] }) => {
  const classes = useStyles()
  const { reservations } = useContext(ReservationContext)

  return (
    <div className={classes.wrap}>
      <BodyMainPanelContentCell />
      <div className={classes.gutter} />
      {dates.map(date => (
        <BodyMainPanelContentColumn
          key={date.format()}
          date={date}
          reservations={reservations.filter(r => r.startAt.isSame(date, 'day'))}
        />
      ))}
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
      <BodyMainPanelContent dates={dates} />
    </div>
  )
}
