import React, { useContext, useEffect, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Reservation } from '@api'
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

export const Plan = ({
  r
}: {
  r: Reservation
}) => {
  const classes = useStyles()
  const [width, setWidth] = useState<number>(100)
  const [top, setTop] = useState<number>((r.startAt.hour() + r.startAt.minute() / 60.0) * 48 - 1)
  const [height, setHeight] = useState<number>(r.length >= 1 ? r.length * 48 - 2 : 22)
  const [backgroundColor, setBackgroundColor] = useState<string>('#3f51b5')

  useEffect(() => {
    setTop((r.startAt.hour() + r.startAt.minute() / 60.0) * 48 - 1)
    setHeight(r.length >= 1 ? r.length * 48 - 2 : 22)
  }, [r])

  const handleMouseEnter = () => {
    setBackgroundColor('#3f51b5')
  }

  const handleMouseLeave = () => {
    setBackgroundColor('#3f51b5')
  }

  return (
    <Button
      component="div"
      color='primary'
      variant='contained'
      className={classes.button}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disableFocusRipple
      style={{
        width: `${width}%`,
        top: `${top}px`,
        height: `${height}px`,
        zIndex: 5,
        backgroundColor: `${backgroundColor}`
      }}
    >
      <div style={{ fontSize: '12px' }}>
        {r.plan.name}
      </div>
      {r.length >= 1 && (
        <div style={{ fontSize: '12px' }}>
          {r.startAt.format('A h:mm')}～{r.endAt.format('h:mm')}
        </div>
      )}
    </Button>
  )
}
