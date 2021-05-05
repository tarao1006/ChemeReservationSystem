import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { PlaceIcon } from './PlaceIcon'
import { Facility } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'table',
      width: '100%',
      margin: '8px 0 8px',
      fontSize: '14px',
    },
    wrap: {
      display: 'flex',
      margin: '2px 16px 0',
      alignItems: 'flex-start',
    },
    container: {
      flex: '1 1 auto',
      width: 'auto',
      display: 'flex',
      alignItems: 'left',
      overflow: 'hidden',
      flexDirection: 'column',
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
    list: {
      maxHeight: '150px',
      overflowY: 'scroll',
    },
    listItem: {
      paddingTop: '2px',
      paddingBottom: '2px',
    },
    listItemText: {
      fontSize: '14px',
    },
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
  }
]

const FacilityListItem = ({
  user,
  onClick
}: {
  user: Facility
  onClick: (user: Facility) => void
}) => {
  const classes = useStyles()

  const handleClick = () => {
    onClick(user)
  }

  return (
    <ListItem className={classes.listItem}>
      <ListItemText disableTypography className={classes.listItemText}>
        {user.name}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton size='small' onClick={handleClick}>
          <CloseIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export const Place = () => {
  const classes = useStyles()
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleChange = (event: object, value: Facility, reason: string) => {
    if (reason === 'select-option') {
      handleAddUser(value)
    }
  }

  const handleAddUser = (facility: Facility) => {
    setFacilities([...facilities, facility])
  }

  const handleRemoveUser = (facility: Facility) => {
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
      <div className={classes.wrap}>
        <PlaceIcon />
        <div className={classes.container}>
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
              facilities.findIndex(u => u.id === option.id) !== -1
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="施設を追加"
              />
            )}
          />
          <div className={classes.list}>
            <List>
              {facilities.map(user => (
                <FacilityListItem
                  key={user.id}
                  user={user}
                  onClick={handleRemoveUser}
                />
              ))}
            </List>
          </div>
        </div>
      </div>
    </div>
  )
}
