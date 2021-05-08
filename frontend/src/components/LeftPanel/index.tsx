import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { useAuth } from '@hooks'
import { FacilityList } from './FacilityList'
import { UserList } from './UserList'

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
  }),
)

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
          <UserList />
        </div>
      ): null}
    </>
  )
}
