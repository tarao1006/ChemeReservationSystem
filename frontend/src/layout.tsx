import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { AuthProvider, FacilityProvider, ReservationProvider, UserProvider } from '@contexts'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
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
  children,
  isLeftPanelOpen,
  setIsLeftPanelOpen
}: {
  children: React.ReactNode
  isLeftPanelOpen: boolean
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const classes = useStyles()

  const handleClick = () => {
    setIsLeftPanelOpen(prev => !prev)
  }

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
    <AuthProvider>
    <FacilityProvider>
    <ReservationProvider>
    <UserProvider>
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
    </UserProvider>
    </ReservationProvider>
    </FacilityProvider>
    </AuthProvider>
    </MuiPickersUtilsProvider>
  )
}
