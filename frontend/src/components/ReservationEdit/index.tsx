import React, { useContext, useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { ReservationContext, PlanContext, FacilityContext, UserContext } from '@contexts'
import { Reservation, User, Facility, Plan } from '@types'
import { Body } from './Body'
import dayjs from 'dayjs'
import { getReservation } from '@api'
import { Loading } from '@components'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // position: 'absolute',
      // top: 0,
      // bottom: 0,
      // left: 0,
      // right: 0,
    },
  }),
)

export const ReservationEdit = () => {
  const { reservations } = useContext(ReservationContext)
  const { facilities } = useContext(FacilityContext)
  const { plans } = useContext(PlanContext)
  const { users } = useContext(UserContext)
  const [reservation, setReservation] = useState<Reservation>()
  const [isOpen, setIsOpen] = useState<boolean>(true)
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    const fetch = async () => {
      const elms = location.pathname.split('/');
      const id = elms[elms.length - 1]
      let reservation = reservations.find(r => r.id === parseInt(id))

      if (!reservation) {
        reservation = await getReservation(id)
      }
  
      setReservation(reservation)
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        const from = location.state as { from: string }
        from ? history.goBack() : history.push('/')
      }, 200)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSubmit = () => {
    setIsOpen(false)
    console.log('submit')
  }

  const handlePlanChange = (plan: Plan) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handlePlanMemoChange = (planMemo: string) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handlePlacesChange = (places: Facility[]) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      places,
    ))
  }

  const handleAttendeesChange = (attendees: User[]) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      reservation.endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      attendees,
      reservation.places,
    ))
  }

  const handleDateChange = (date: dayjs.Dayjs) => {
    const newStartAt = date.hour(reservation.startAt.hour()).minute(reservation.startAt.minute())
    const newEndAt = date.hour(reservation.endAt.hour()).minute(reservation.endAt.minute())
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      newStartAt,
      newEndAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handleStartAtChange = (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      startAt,
      endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  const handleEndAtChange = (endAt: dayjs.Dayjs) => {
    setReservation(new Reservation(
      reservation.id,
      reservation.creator,
      reservation.startAt,
      endAt,
      reservation.plan,
      reservation.planMemo,
      reservation.createdAt,
      reservation.updatedAt,
      reservation.attendees,
      reservation.places,
    ))
  }

  return (
    (plans.length !== 0 && facilities.length !== 0 && users.length !== 0) ? (
      <Dialog fullScreen open={isOpen} onClose={handleClose} className={classes.root} transitionDuration={200}>
      <IconButton color="inherit" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
      {reservation && (
        <Body
          reservation={reservation}
          onSubmit={handleSubmit}
          onPlanChange={handlePlanChange}
          onPlanMemoChange={handlePlanMemoChange}
          onDateChange={handleDateChange}
          onStartAtChange={handleStartAtChange}
          onEndAtChange={handleEndAtChange}
          onPlacesChange={handlePlacesChange}
          onAttendeesChange={handleAttendeesChange}
        />
      )}
      </Dialog>
    ): <Loading />
  )
}
