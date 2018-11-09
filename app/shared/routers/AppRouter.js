import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import App from '../../renderer-process/appMain/components/App'
import Test from '../../renderer-process/appMain/components/Test'

export const history = createHistory()

const AppRouter = () => (
  <Router history={ history }>
    <div>
      <Switch>
        <Route path="/" component={ App } exact={ true } />
        <Route path="/test" component={ Test } />
      </Switch>
    </div>
  </Router>
)

export default AppRouter