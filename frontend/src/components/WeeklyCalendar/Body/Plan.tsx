import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { PopoverOrigin } from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import { Reservation } from '@types'
import { PlanDetail, PlanNew } from '@components'

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

export const Plan = ({
  reservation,
  onClose,
  setNewReservation
}: {
  reservation: Reservation
  onClose?: () => void
  setNewReservation: React.Dispatch<React.SetStateAction<Reservation>>
}) => {
  const classes = useStyles()
  const ref = useRef<HTMLDivElement>()
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const isOpen = Boolean(anchorEl)
  const [width, setWidth] = useState<number>(100)
  const [top, setTop] = useState<number>((reservation.startAt.hour() + reservation.startAt.minute() / 60.0) * 48 - 1)
  const [height, setHeight] = useState<number>(reservation.length >= 1 ? reservation.length * 48 - 2 : 22)
  const [backgroundColor, setBackgroundColor] = useState<string>('#3f51b5')
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

  useEffect(() => {
    setTop((reservation.startAt.hour() + reservation.startAt.minute() / 60.0) * 48 - 1)
    setHeight(reservation.length >= 1 ? reservation.length * 48 - 2 : 22)
  }, [reservation])

  const handleMouseEnter = () => setBackgroundColor('#3f51b5')
  const handleMouseLeave = () => setBackgroundColor('#3f51b5')

  const setAnchor = (target: HTMLElement) => {
    const targetRect = target.getBoundingClientRect()
    const targetRectLeft = targetRect.left
    const targetRectRight = targetRect.right
    const targetRectTop = targetRect.top
    const targetRectBottom = targetRect.bottom
    const halfInnerHeight = window.innerHeight / 2.0
    const halfInnerWidth = window.innerWidth / 2.0

    setAnchorEl(target)

    let anchorOriginVertical: Vertical
    let anchorOriginHorizontal: Horizontal
    let transformOriginVertical: Vertical
    let transformOriginHorizontal: Horizontal
    let topMargin: string
    let leftMargin: string

    if (targetRectTop > halfInnerHeight && targetRectBottom > halfInnerHeight) {
      anchorOriginVertical = 'top'
      transformOriginVertical = 'bottom'
      topMargin = '-12px'
    } else if (targetRectTop < halfInnerHeight && targetRectBottom < halfInnerHeight) {
      anchorOriginVertical = 'bottom'
      transformOriginVertical = 'top'
      topMargin = '12px'
    } else {
      anchorOriginVertical = 'center'
      transformOriginVertical = 'center'
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
    onClose && onClose()
    setAnchorEl(null)
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
      <PlanNew
        reservation={reservation}
        isOpen={isOpen}
        onClose={handleClose}
        setNewReservation={setNewReservation}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        margin={margin}
      />
      {/* {reservation.id === 0 ? (
        anchorEl ? (
          <PlanNew
            reservation={reservation}
            isOpen={true}
            onClose={handleClose}
            anchorEl={anchorEl}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            margin={margin}
          />
        ) : null
      ) : (
        <PlanDetail
          reservation={reservation}
          isOpen={isOpen}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          margin={margin}
        />
      )} */}
    </>
  )
}
