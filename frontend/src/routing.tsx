import React from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { WeeklyCalendar } from '@pages'
import { ReservationEdit } from '@components'
import { RedirectRoute } from './RedirectRoute'
import dayjs from 'dayjs'
import {
  AuthProvider,
  FacilityProvider,
  PlanProvider,
  ReservationProvider,
  UserProvider
} from '@contexts'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
        body: {
          overflow: 'hidden',
        },
        '*::-webkit-scrollbar': {
          background: "transparent",
          height: "8px",
          width: "8px",
        },
        '*::-webkit-scrollbar-thumb': {
          border: "none",
          boxShadow: "none",
          background: "#dadce0",
          borderRadius: "8px",
          minHeight: "40px"
        },
      },
    },
  },
})

const Provider = ({ children }) => {

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <AuthProvider>
          <FacilityProvider>
            <ReservationProvider>
              <UserProvider>
                <PlanProvider>
                  {children}
                </PlanProvider>
              </UserProvider>
            </ReservationProvider>
          </FacilityProvider>
        </AuthProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
}

export const Routing = () => {

  return (
    <Provider>
      <Router>
        <Route path="/" exact>
          <Redirect to={`/calendar/month/${dayjs().startOf('day').format('YYYY-MM-DD')}`} />
        </Route>
        <RedirectRoute
          path='/calendar/day/:date'
          exact
          component={<WeeklyCalendar />}
        />
        <RedirectRoute
          path='/calendar/week/:date'
          exact
          component={<WeeklyCalendar />}
        />
        <RedirectRoute
          path='/calendar/month/:date'
          exact
          component={<WeeklyCalendar />}
        />
        <RedirectRoute
          path='/calendar/reservationedit/:id'
          exact
          component={<ReservationEdit />}
        />
      </Router>
    </Provider>
  )
}
