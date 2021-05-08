import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Header, LeftPanel } from '@components'
import { headerHeight } from '@config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root:{
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
    },
    wrap: {
      flex: '1 1 auto',
      overflow: 'hidden',
      height: '100%',
    },
    container: {
      position: 'relative',
      height: '100%',
    },
    main: {
      position: 'relative',
      width: '100%',
      height: `calc(100vh - ${headerHeight}px)`,
      display: 'flex',
      boxSizing: 'border-box',
    },
    mainPanel: {
      flex: '1 1 auto',
      overflow: 'hidden',
      position: 'relative',
    },
  },
));

export const Layout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const classes = useStyles()
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true)

  const handleClick = () => {
    setIsLeftPanelOpen(prev => !prev)
  }

  return (
    <>
      <CssBaseline />
      <div className={classes.root}>
        <div className={classes.wrap}>
          <div className={classes.container}>
            <Header onClick={handleClick} />
            <div className={classes.main}>
              <LeftPanel isOpen={isLeftPanelOpen} />
              <div className={classes.mainPanel}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
