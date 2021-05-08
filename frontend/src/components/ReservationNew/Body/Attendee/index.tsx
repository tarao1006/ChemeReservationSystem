import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { User } from '@types'
import { useUsers } from '@hooks'
export { AttendeeIcon } from './AttendeeIcon'

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

const UserChip = ({
  user,
  onDelete
}: {
  user: User
  onDelete: (user: User) => void
}) => {
  const classes = useStyles()

  const handleDelete = () => {
    onDelete(user)
  }

  return (
    <Chip
      className={classes.chip}
      label={user.name}
      onDelete={handleDelete}
    />
  )
}

export const Attendee = ({
  attendees,
  onAttendeesChange
}:{
  attendees: User[]
  onAttendeesChange: (attendees: User[]) => void
}) => {
  const classes = useStyles()
  const [inputValue, setInputValue] = useState<string>('')
  const { users } = useUsers()

  const handleChange = (event: object, value: User, reason: string) => {
    if (reason === 'select-option') {
      handleAddUser(value)
    }
  }

  const handleAddUser = (user: User) => {
    onAttendeesChange([...attendees, user])
  }

  const handleRemoveUser = (user: User) => {
    let newAttendees = [...attendees]
    const idx = newAttendees.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      newAttendees.splice(idx, 1)
      onAttendeesChange(newAttendees)
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
        options={users}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        getOptionSelected={(option: User, value: User) => (
          attendees.findIndex(a => a.id === option.id) !== -1
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="参加者を追加"
          />
        )}
      />
      <div className={classes.chips}>
        {attendees.map(attendee => (
          <UserChip
            key={attendee.id}
            user={attendee}
            onDelete={handleRemoveUser}
          />
        ))}
      </div>
    </div>
  )
}
