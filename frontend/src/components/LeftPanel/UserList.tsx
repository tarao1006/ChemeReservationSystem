import React, { useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { useUsers } from '@hooks'
import { User } from '@types'

const useStyles = makeStyles(() =>
  createStyles({
    list: {
      paddingLeft: '4px',
      paddingRight: '4px',
    },
    listItem: {
      height: '32px',
    },
    listItemCheckbox: {
      transition: 'border-color .2s cubic-bezier(0.4,0,0.2,1)',
      flex: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
      }
    },
  }),
)

const UserListItem = ({
  user,
  onClick,
  checked
}: {
  user: User
  onClick: (value: string) => void,
  checked: boolean
}) => {
  const classes = useStyles()

  const handleClick = () => {
    onClick(user.id)
  }

  return (
    <ListItem
      className={classes.listItem}
      onClick={handleClick}
      button
      dense
      disableRipple
      disableTouchRipple
    > 
      <Checkbox
        className={classes.listItemCheckbox}
        edge="start"
        checked={checked}
        size="medium"
        color="default"
        disableRipple
      />
      <ListItemText
        disableTypography
        style={{
          fontSize: '14px',
        }}
      >
        {user.name}
      </ListItemText>
    </ListItem>
  )
}

export const UserList = () => {
  const classes = useStyles()
  const { users, checked, addCheck, deleteCheck } = useUsers()
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(prev => !prev)
  }

  const handleToggle = (id: string) => {
    checked.indexOf(id) === -1 ? addCheck(id) : deleteCheck(id)
  }

  return (
    <List>
      <ListItem onClick={handleClick} button>
        <ListItemText disableTypography primary="ユーザー" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open}>
        <List className={classes.list}>
          {users.map(u => (
            <UserListItem
              key={u.id}
              user={u}
              onClick={handleToggle}
              checked={checked.indexOf(u.id) !== -1}
            />
          ))}
        </List>
      </Collapse>
    </List>
  )
}
