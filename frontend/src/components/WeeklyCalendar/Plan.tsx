import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { PopoverOrigin } from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import { Reservation } from '@types'
import { PlanDetail } from '@components'

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

type Vertical = "top" | "bottom"
type Horizontal = "center" | "left" | "right"

enum Position {
  TopRight,
  TopLeft,
  TopCenter,
  BottomRight,
  BottomLeft,
  BottomCenter
}

export const Plan = ({
  reservation
}: {
  reservation: Reservation
}) => {
  const classes = useStyles()
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

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget
    const targetRect = target.getBoundingClientRect()
    const targetRectLeft = targetRect.left
    const targetRectRight = targetRect.right
    const targetRectTop = targetRect.top
    const targetRectBottom = targetRect.bottom
    const halfInnerHeight = window.innerHeight / 2.0
    const halfInnerWidth = window.innerWidth / 2.0

    setAnchorEl(target)

    let position: Position
    if (targetRectTop > halfInnerHeight && targetRectBottom > halfInnerHeight) {
      if (targetRectLeft < halfInnerWidth && targetRectRight < halfInnerWidth) {
        position = Position.TopRight
      } else if (targetRectLeft > halfInnerWidth && targetRectRight > halfInnerWidth) {
        position = Position.TopLeft
      } else {
        position = Position.TopCenter
      }
    } else {
      if (targetRectLeft < halfInnerWidth && targetRectRight < halfInnerWidth) {
        position = Position.BottomRight
      } else if (targetRectLeft > halfInnerWidth && targetRectRight > halfInnerWidth) {
        position = Position.BottomLeft
      } else {
        position = Position.BottomCenter
      }
    }

    let anchorOriginVertical: Vertical
    let anchorOriginHorizontal: Horizontal
    let transformOriginVertical: Vertical
    let transformOriginHorizontal: Horizontal
    let topMargin: string
    let leftMargin: string

    switch (position) {
      case Position.TopRight:
        anchorOriginVertical = 'top'
        transformOriginVertical = 'bottom'
        anchorOriginHorizontal = 'right'
        transformOriginHorizontal = 'left'
        topMargin = '-12px'
        leftMargin = '12px'
        break
      case Position.TopLeft:
        anchorOriginVertical = 'top'
        transformOriginVertical = 'bottom'
        anchorOriginHorizontal = 'left'
        transformOriginHorizontal = 'right'
        topMargin = '-12px'
        leftMargin = '-12px'
        break
      case Position.TopCenter:
        anchorOriginVertical = 'top'
        transformOriginVertical = 'bottom'
        anchorOriginHorizontal = 'center'
        transformOriginHorizontal = 'center'
        topMargin = '-12px'
        leftMargin = '0px'
        break
      case Position.BottomRight:
        anchorOriginVertical = 'bottom'
        transformOriginVertical = 'top'
        anchorOriginHorizontal = 'right'
        transformOriginHorizontal = 'left'
        topMargin = '12px'
        leftMargin = '12px'
        break
      case Position.BottomLeft:
        anchorOriginVertical = 'bottom'
        transformOriginVertical = 'top'
        anchorOriginHorizontal = 'left'
        transformOriginHorizontal = 'right'
        topMargin = '12px'
        leftMargin = '-12px'
        break
      case Position.BottomCenter:
        anchorOriginVertical = 'bottom'
        transformOriginVertical = 'top'
        anchorOriginHorizontal = 'center'
        transformOriginHorizontal = 'center'
        topMargin = '12px'
        leftMargin = '0px'
        break
      default:
        console.error("invalid position")
        break
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

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
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
      <PlanDetail
        reservation={reservation}
        isOpen={isOpen}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        margin={margin}
      />
    </>
  )
}
