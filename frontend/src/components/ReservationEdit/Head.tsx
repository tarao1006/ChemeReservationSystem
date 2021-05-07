import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: '8px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      height: '36px',
      overflow: 'hidden',
    },
    button: {
      height: '36px',
      width: '36px',
    }
  })
)

export const Head = ({
  onClose,
}: {
  onClose: () => void
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <IconButton size='medium' onClick={onClose} className={classes.button}>
        <CloseIcon />
      </IconButton>
      <Button color="primary" variant="contained" type="submit">
        保存
      </Button>
    </div>
  )
}