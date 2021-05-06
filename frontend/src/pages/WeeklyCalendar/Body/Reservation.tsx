import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { PopoverOrigin } from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import { Reservation as ReservationModel, Plan, User, Facility } from '@types'
import { ReservationDetail, ReservationNew } from '@components'
import dayjs from 'dayjs'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      display: 'block',
      position: 'absolute',
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0,
      paddingLeft: '8px',
      whiteSpace: 'nowrap',
      textAlign: 'left',
    },
  }),
)

type Vertical = "center" | "top" | "bottom"
type Horizontal = "center" | "left" | "right"

export const Reservation = ({
  reservation,
  onClose,
  onSubmit,
  updateReservations,
  replaceReservations
}: {
  reservation: ReservationModel
  onClose: (reservation: ReservationModel) => void
  onSubmit: (reservation: ReservationModel) => Promise<void>
  updateReservations: (newReservation: ReservationModel) => void
  replaceReservations: (newReservation: ReservationModel) => void
}) => {
  const classes = useStyles()
  const history = useHistory()
  const params = useParams()
  const ref = useRef<HTMLDivElement>()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)
  const [width, setWidth] = useState<number>(100)
  const [backgroundColor, setBackgroundColor] = useState<string>(reservation.places.length !== 0 ? reservation.places[0].colorCode : '#3f51b5')
  const [anchorOrigin, setAnchorOrigin] = useState<PopoverOrigin>({
    vertical: 'bottom',
    horizontal: 'left'
  })
  const [transformOrigin, setTransformOrigin] = useState<PopoverOrigin>({
    vertical: 'top',
    horizontal: 'center'
  })
  const [margin, setMargin] = useState<{
    top: string
    left: string
  }>({
    top: "12px",
    left: "0px",
  })

  const top = (reservation.startAt.hour() + reservation.startAt.minute() / 60.0) * 48 - 1
  const height = reservation.length >= 1 ? reservation.length * 48 - 2 : 22

  const handleMouseEnter = () => setBackgroundColor(backgroundColor)
  const handleMouseLeave = () => setBackgroundColor(backgroundColor)

  const setAnchor = (target: HTMLElement) => {
    const targetRect = target.getBoundingClientRect()
    const targetRectLeft = targetRect.left
    const targetRectRight = targetRect.right
    const targetRectTop = targetRect.top
    const targetRectBottom = targetRect.bottom
    const halfInnerHeight = window.innerHeight / 2.0
    const halfInnerWidth = window.innerWidth / 2.0

    const quarterInnerHeight = window.innerHeight / 4.0
    const quarterThreeInnerHeight = window.innerHeight * 3.0 / 4.0

    setAnchorEl(target)

    let anchorOriginVertical: Vertical
    let anchorOriginHorizontal: Horizontal
    let transformOriginVertical: Vertical
    let transformOriginHorizontal: Horizontal
    let topMargin: string
    let leftMargin: string

    if (targetRectTop > quarterThreeInnerHeight && targetRectBottom > quarterThreeInnerHeight) {
      anchorOriginVertical = 'top'
      transformOriginVertical = 'bottom'
      topMargin = '-12px'
    } else if (targetRectTop < quarterInnerHeight && targetRectBottom < quarterInnerHeight) {
      anchorOriginVertical = 'bottom'
      transformOriginVertical = 'top'
      topMargin = '12px'
    } else {
      if (targetRectBottom > quarterThreeInnerHeight) {
        anchorOriginVertical = 'top'
        transformOriginVertical = 'bottom'
      } else if (targetRectTop < quarterInnerHeight) {
        anchorOriginVertical = 'top'
        transformOriginVertical = 'top'
      } else {
        anchorOriginVertical = 'center'
        transformOriginVertical = 'center'
      }
      topMargin = '0px'
    }

    if (targetRectLeft < halfInnerWidth && targetRectRight < halfInnerWidth) {
      anchorOriginHorizontal = 'right'
      transformOriginHorizontal = 'left'
      leftMargin = '12px'
    } else if (targetRectLeft > halfInnerWidth && targetRectRight > halfInnerWidth) {
      anchorOriginHorizontal = 'left'
      transformOriginHorizontal = 'right'
      leftMargin = '-12px' 
    } else {
      anchorOriginHorizontal = 'center'
      transformOriginHorizontal = 'center'
      leftMargin = '0px'
    }

    if (anchorOriginVertical === 'center' && anchorOriginHorizontal === 'center') {
      anchorOriginVertical = 'center'
      transformOriginVertical = 'center'
      anchorOriginHorizontal = 'left'
      transformOriginHorizontal = 'right'
      topMargin = '0px'
      leftMargin = '-12px'
    }

    setAnchorOrigin({
      vertical: anchorOriginVertical,
      horizontal: anchorOriginHorizontal,
    })
    setTransformOrigin({
      vertical: transformOriginVertical,
      horizontal: transformOriginHorizontal,
    })
    setMargin({
      top: topMargin,
      left: leftMargin,
    })
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchor(e.currentTarget)
  }

  useEffect(() => {
    if (reservation.id === 0) {
      (ref.current !== undefined) && setAnchor(ref.current)
    }
  }, [ref])

  const handleClose = () => {
    onClose(reservation)
    setAnchorEl(null)
  }

  const handleSubmit = () => {
    onSubmit(reservation)
    setAnchorEl(null)
  }

  const handlePlanChange = (plan: Plan) => {
    updateReservations(new ReservationModel(
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
    updateReservations(new ReservationModel(
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
    updateReservations(new ReservationModel(
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
    updateReservations(new ReservationModel(
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
    replaceReservations(new ReservationModel(
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

    !date.isSame(dayjs(params["date"]), 'week') && history.push(`/calendar/week/${date.format('YYYY-MM-DD')}`)
  }

  const handleStartAtChange = (startAt: dayjs.Dayjs, endAt: dayjs.Dayjs) => {
    replaceReservations(new ReservationModel(
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
    replaceReservations(new ReservationModel(
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
    <>
      <Button
        ref={ref}
        component="div"
        color='primary'
        variant='contained'
        className={classes.button}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disableFocusRipple
        disableRipple
        style={{
          width: `${width}%`,
          top: `${top}px`,
          height: `${height}px`,
          zIndex: 5,
          backgroundColor: `${backgroundColor}`
        }}
      >
        <div style={{ fontSize: '12px' }}>
          {reservation.plan.name}
        </div>
        {reservation.length >= 1 && (
          <div style={{ fontSize: '12px' }}>
            {reservation.startAt.format('A h:mm')}～{reservation.endAt.format('h:mm')}
          </div>
        )}
      </Button>
      {reservation.id === 0 ? (
        anchorEl ? (
          <ReservationNew
            reservation={reservation}
            isOpen={isOpen}
            onClose={handleClose}
            onSubmit={handleSubmit}
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            margin={margin}
            onPlanChange={handlePlanChange}
            onPlanMemoChange={handlePlanMemoChange}
            onDateChange={handleDateChange}
            onStartAtChange={handleStartAtChange}
            onEndAtChange={handleEndAtChange}
            onPlacesChange={handlePlacesChange}
            onAttendeesChange={handleAttendeesChange}
          />
        ) : null
      ) : (
        <ReservationDetail
          reservation={reservation}
          isOpen={isOpen}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          margin={margin}
        />
      )}
    </>
  )
}
