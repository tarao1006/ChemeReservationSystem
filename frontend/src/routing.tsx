import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Component1 } from './components/Component1'
import { Component2 } from './components/Component2'
import { Layout } from './layout'

export const Routing = () => {
  return (
    <Router>
      <Layout>
        <Route path='/component1' component={Component1} />
        <Route path='/component2' component={Component2} />
      </Layout>
    </Router>
  )
}
