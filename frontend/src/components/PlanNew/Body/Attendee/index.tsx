import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { User } from '@types'
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

const allUsers: User[] = [
  {
    id: 'user001',
    name: '三浦 昌光',
    nameRuby: 'ミウラ マサミツ',
    emailAddress: 'msmt-mur@plala.or.jp',
    types: [{
      id: 1,
      name: '教授A'
    }]
  },
  {
    id: 'user002',
    name: '畑中 祐美',
    nameRuby: 'ハタケナカ ユウミ',
    emailAddress: 'knkthdti@dti.ne.jp',
    types: [{
      id: 1,
      name: '教授A'
    }]
  },
  {
    id: 'user003',
    name: '久保田 俊彰',
    nameRuby: 'クボタ トシアキ',
    emailAddress: 'kubota0705@dti.ad.jp',
    types: [{
      id: 2,
      name: '教授B'
    }]
  },
  {
    id: 'user004',
    name: '松野 長生',
    nameRuby: 'マツノ ナガオ',
    emailAddress: '',
    types: [{
      id: 2,
      name: '教授B'
    }]
  },
  {
    id: 'user005',
    name: '安達 悠里',
    nameRuby: 'アダチ ユリ',
    emailAddress: 'itada0829@plala.or.jp',
    types: [{
      id: 3,
      name: '生徒A'
    }]
  },
  {
    id: 'user006',
    name: '塚本 清重',
    nameRuby: 'ツカモト キヨシゲ',
    emailAddress: 'tukamoto73@sannet.ne.jp',
    types: [{
      id: 4,
      name: '生徒B'
    }]
  },
  {
    id: 'user007',
    name: '西原 吉治',
    nameRuby: 'ニシハラ キチジ',
    emailAddress: '',
    types: [{
      id: 4,
      name: '生徒B'
    }]
  }
]

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
        options={allUsers}
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
