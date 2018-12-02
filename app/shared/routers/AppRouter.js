import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import App from '../../renderer-process/appMain/components/App'
import Completed from '../../renderer-process/appMain/components/Completed'
import Settings from '../../renderer-process/appMain/components/Settings'
import AddNewOrder from '../../renderer-process/appMain/components/AddNewOrder'

export const history = createHistory()

const AppRouter = () => (
  <Router history={ history }>
    <div>
      <Switch>
        <Route path="/home" component={ App } exact={ true } />
        <Route path="/completed" component={ Completed } />
        <Route path="/settings" component={ Settings } />
        <Route path="/addNewOrder" component={ AddNewOrder } />
      </Switch>
    </div>
  </Router>
)

export default AppRouter