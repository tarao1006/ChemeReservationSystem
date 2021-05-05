import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Facility } from '@types'
export { PlaceIcon } from './PlaceIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'left',
      overflow: 'hidden',
      flexDirection: 'column',
    },
    chips: {
      display: 'flex',
      maxHeight: '150px',
      overflowX: 'scroll',
      paddingTop: '8px',
      paddingBottom: '8px',
    },
    chip: {
      flex: 'none',
      fontSize: '14px',
      margin: '2px',
    }
  })
)

const allFacilities = [
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
  },
  {
    id: 4,
    name: '会議室A',
    types: [{
      id: 2,
      name: '施設タイプB'
    }]
  },
  {
    id: 5,
    name: '会議室B',
    types: [{
      id: 2,
      name: '施設タイプB'
    }]
  },
  {
    id: 6,
    name: '休憩室A',
    types: [{
      id: 1,
      name: '施設タイプC'
    }]
  },
  {
    id: 7,
    name: '休憩室B',
    types: [{
      id: 1,
      name: '施設タイプC'
    }]
  }
]

const FacilityChip = ({
  facility,
  onDelete
}: {
  facility: Facility
  onDelete: (facility: Facility) => void
}) => {
  const classes = useStyles()

  const handleDelete = () => {
    onDelete(facility)
  }

  return (
    <Chip
      className={classes.chip}
      label={facility.name}
      onDelete={handleDelete}
    />
  )
}

export const Place = () => {
  const classes = useStyles()
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleChange = (event: object, value: Facility, reason: string) => {
    if (reason === 'select-option') {
      handleAddFacility(value)
    }
  }

  const handleAddFacility = (facility: Facility) => {
    setFacilities([...facilities, facility])
  }

  const handleRemoveFacility = (facility: Facility) => {
    let newFacilities = [...facilities]
    const idx = newFacilities.findIndex(f => f.id === facility.id)
    if (idx !== -1) {
      newFacilities.splice(idx, 1)
      setFacilities(newFacilities)
    }
  }

  const handleInputChange = (event: object, value: string, reason: string) => {
    switch (reason) {
      case "input":
        setInputValue(value)
        break
      case "reset":
        setInputValue('')
        break
      case "clear":
        setInputValue('')
        break
      default:
        setInputValue('')
        break
    }
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        fullWidth
        disableClearable
        options={allFacilities}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        getOptionSelected={(option: Facility, value: Facility) => (
          facilities.findIndex(f => f.id === option.id) !== -1
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="施設を追加"
          />
        )}
      />
      <div className={classes.chips}>
        {facilities.map(facility => (
          <FacilityChip
            key={facility.id}
            facility={facility}
            onDelete={handleRemoveFacility}
          />
        ))}
      </div>
    </div>
  )
}
