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
import { AttendeeIcon } from './AttendeeIcon'
import { User } from '@types'

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

const UserListItem = ({
  user,
  onClick
}: {
  user: User
  onClick: (user: User) => void
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
          <div className={classes.list}>
            <List>
              {users.map(user => (
                <UserListItem
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
