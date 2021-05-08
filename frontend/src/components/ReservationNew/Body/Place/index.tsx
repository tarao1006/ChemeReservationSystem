import React, { useContext, useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { Facility } from '@types'
import { useFacilities } from '@hooks'
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

export const Place = ({
  places,
  onPlacesChange
}: {
  places: Facility[],
  onPlacesChange: (places: Facility[]) => void
}) => {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState<string>('')
  const { facilities } = useFacilities()

  const handleChange = (event: object, value: Facility, reason: string) => {
    if (reason === 'select-option') {
      handleAddFacility(value)
    }
  }

  const handleAddFacility = (facility: Facility) => {
    onPlacesChange([...places, facility])
  }

  const handleRemoveFacility = (facility: Facility) => {
    let newPlaces = [...places]
    const idx = newPlaces.findIndex(f => f.id === facility.id)
    if (idx !== -1) {
      newPlaces.splice(idx, 1)
      onPlacesChange(newPlaces)
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
        options={facilities}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        getOptionSelected={(option: Facility, value: Facility) => (
          places.findIndex(p => p.id === option.id) !== -1
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="施設を追加"
          />
        )}
      />
      <div className={classes.chips}>
        {places.map(place => (
          <FacilityChip
            key={place.id}
            facility={place}
            onDelete={handleRemoveFacility}
          />
        ))}
      </div>
    </div>
  )
}
