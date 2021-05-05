import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { FacilityIcon } from './PlaceIcon'
import { Facility } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'table',
      width: '100%',
      margin: '16px 0 20px',
      fontSize: '14px',
    },
    wrap: {
      display: 'flex',
      margin: '2px 16px 0',
      alignItems: 'center',
    },
    container: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    },
    select: {
      width: '64px',
      height: '24px',
      flex: '1 1 auto',
      margin: '0 6px',
      fontSize: '14px',
    },
    selectItem: {
      minWidth: '150px',
      fontSize: '14px',
      lineHeight: '40px',
      padding: '2px 16px',
    },
  })
)

const facilities = [
  {
    id: 1,
    name: '施設A',
    types: [{
      id: 1,
      name: '施設タイプA'
    }]
  },
  {
    id: 2,
    name: '施設B',
    types: [{
      id: 1,
      name: '施設タイプA'
    }]
  },
  {
    id: 3,
    name: '施設C',
    types: [{
      id: 1,
      name: '施設タイプA'
    }]
  }
]

const PlaceSelect = ({
  place,
  setPlace
}: {
  place: Facility
  setPlace: React.Dispatch<React.SetStateAction<Facility>>
}) => {
  const classes = useStyles()

  const handleChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPlace(facilities.find(f => f.name === (e.target.value as string)))
  }

  return (
    <Select
      value={place.name}
      onChange={handleChange}
      className={classes.select}
      MenuProps={{
        style: {
          maxHeight: '400px',
        }
      }}
      inputProps={{
        fontSize: '14px',
      }}
    >
      {facilities.map(f => (
        <MenuItem
          key={f.id}
          value={f.name}
          className={classes.selectItem}
        >
          {f.name}
        </MenuItem>
      ))}
    </Select>
  )
}

export const Place = () => {
  const classes = useStyles()
  const [place, setPlace] = useState<Facility>(facilities[0])

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <FacilityIcon />
        <div className={classes.container}>
          <PlaceSelect
            place={place}
            setPlace={setPlace}
          />
        </div>
      </div>
    </div>
  )
}
