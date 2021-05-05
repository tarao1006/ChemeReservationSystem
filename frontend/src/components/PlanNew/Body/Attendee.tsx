import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { AttendeeIcon } from './AttendeeIcon'
import { User } from '@types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'block',
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

export const Attendee = () => {
  const classes = useStyles()
  const [users, setUsers] = useState<User[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleChange = (event: object, value: User, reason: string) => {
    if (reason === 'select-option') {
      handleAddUser(value)
    }
  }

  const handleAddUser = (user: User) => {
    setUsers([...users, user])
  }

  const handleRemoveUser = (user: User) => {
    let newUsers = [...users]
    const idx = newUsers.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      newUsers.splice(idx, 1)
      setUsers(newUsers)
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
        <AttendeeIcon />
        <div className={classes.container}>
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
              users.findIndex(u => u.id === option.id) !== -1
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="参加者を追加"
              />
            )}
          />
          <div className={classes.chips}>
            {users.map(user => (
              <UserChip
                key={user.id}
                user={user}
                onDelete={handleRemoveUser}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
