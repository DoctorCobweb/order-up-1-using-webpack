import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
import thunk from 'redux-thunk'
import r from 'rethinkdb'
import config from '../../main-process/knuckle-dragger/knuckle-dragger-config'
import '../../shared/styles/styles.scss'
import App from './components/App'

import reducer from '../../shared/reducers/reducer'
const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

const initialState = getInitialStateRenderer()
const store = createStore(
  reducer,
  initialState,
  compose(applyMiddleware(forwardToMain, thunk))
  // applyMiddleware(forwardToMain)
)
replayActionRenderer(store)

// Provider will provide the redux store to 
// all components in the app
const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render( jsx, document.getElementById('root'))

// play around with rethinkdb stuff in renderer process
r.connect({ host: dbHost, port: dbPort})
  .then(conn => {
    return r.db(dbName).table(dbTableName).run(conn)
  })
  .then(results => {
    // results is a cursor
    return results.toArray()
  })
  .then(arrayResults => {
    console.log(arrayResults)
  })
  .catch(err => {
    if (err) throw err
})