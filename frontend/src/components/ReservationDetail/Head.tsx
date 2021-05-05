import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flex: 'none',
      height: '44px',
      overflow: 'visible',
      position: 'relative',
    },
    wrap: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      height: '48px',
      marginTop: '-8px',
      overflow: 'hidden',
      paddingBottom: '24px',
      borderRadius: '2px 2px 0 0 ',
    },
    container: {
      flex: 'none',
      padding: '12px 6px 0 6px',
      display: 'flex',
      flexFlow: 'row-reverse',
    },
    closeButton: {
      marginLeft: '8px',
    },
    buttonGroup: {
      display: 'flex',
    },
  })
)

export const Head = ({
  handleClose,
  handleEdit,
  handleDelete
}: {
  handleClose: () => void
  handleEdit: () => void
  handleDelete: () => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.wrap}>
        <div className={classes.container}>
          <IconButton className={classes.closeButton} size='small' onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={classes.buttonGroup}>
            <IconButton size='small' onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size='small' onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}