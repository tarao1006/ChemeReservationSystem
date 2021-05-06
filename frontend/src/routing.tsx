import React, { useState } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { WeeklyCalendar } from '@components'
import { Layout } from './layout'
import { RedirectRoute } from './RedirectRoute'
import dayjs from 'dayjs'

export const Routing = () => {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(true)

  return (
    <Router>
      <Layout isLeftPanelOpen={isLeftPanelOpen} setIsLeftPanelOpen={setIsLeftPanelOpen}>
        <Route path="/" exact>
          <Redirect to={`/calendar/month/${dayjs().startOf('day').format('YYYY-MM-DD')}`} />
        </Route>
        <RedirectRoute
          path='/calendar/day/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
        <RedirectRoute
          path='/calendar/week/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
        <RedirectRoute
          path='/calendar/month/:date'
          exact
          component={WeeklyCalendar}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
        />
      </Layout>
    </Router>
  )
}
