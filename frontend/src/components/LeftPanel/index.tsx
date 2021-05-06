import React, { useEffect, useContext, useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { FacilityContext } from '@contexts'
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
    }
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
        size="small"
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

export const LeftPanel = ({
  isOpen
}: {
  isOpen: boolean
}) => {
  const classes = useStyles()
  const { facilities, checked, setChecked } = useContext(FacilityContext)

  const handleToggle = (value: number) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <div
      className={classes.root}
      style={{
        marginLeft: isOpen ? '20px' : '-200px',
      }}
    >
      <div>
        <List className={classes.list}>
          {facilities.map((f, i) => (
            <FacilityListItem
              key={f.id}
              facility={f}
              onClick={handleToggle}
              checked={checked.indexOf(f.id) !== -1}
            />
          ))}
        </List>
      </div>
    </div>
  )
}
