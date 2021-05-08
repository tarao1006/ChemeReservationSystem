import React, { useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { useAuth, useFacilities } from '@hooks'
import { Facility } from '@types'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      width: '200px',
      marginRight: '8px',
      marginTop: '84px',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0s',
    },
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

const FacilityListItem = ({
  facility,
  onClick,
  checked
}: {
  facility: Facility
  onClick: (value: number) => void,
  checked: boolean
}) => {
  const classes = useStyles()

  const handleClick = () => {
    onClick(facility.id)
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
        style={{
          color: facility.colorCode,
        }}
        disableRipple
      />
      <ListItemText
        disableTypography
        style={{
          fontSize: '14px',
        }}
      >
        {facility.name}
      </ListItemText>
    </ListItem>
  )
}

const FacilityList = () => {
  const classes = useStyles()
  const { facilities, checked, addCheck, deleteCheck } = useFacilities()
  const [open, setOpen] = useState(true)

  const handleClick = () => {
    setOpen(prev => !prev)
  }

  const handleToggle = (id: number) => {
    checked.indexOf(id) === -1 ? addCheck(id) : deleteCheck(id)
  }

  return (
    <List>
      <ListItem onClick={handleClick} button>
        <ListItemText disableTypography primary="施設" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open}>
        <List className={classes.list}>
          {facilities.map(f => (
            <FacilityListItem
              key={f.id}
              facility={f}
              onClick={handleToggle}
              checked={checked.indexOf(f.id) !== -1}
            />
          ))}
        </List>
      </Collapse>
    </List>
  )
}

export const LeftPanel = ({
  isOpen
}: {
  isOpen: boolean
}) => {
  const classes = useStyles()
  const { currentUser } = useAuth()

  return (
    <>
      {currentUser !== undefined ? (
        <div
          className={classes.root}
          style={{
            marginLeft: (isOpen) ? '0px' : '-200px',
          }}
        >
          <FacilityList />
        </div>
      ): null}
    </>
  )
}
