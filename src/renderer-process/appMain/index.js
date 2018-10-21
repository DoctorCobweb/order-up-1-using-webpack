import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import r from 'rethinkdb'
import config from '../../main-process/knuckle-dragger/knuckle-dragger-config'

import '../../shared/styles/styles.scss'
import App from './components/App'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../../shared/reducers/reducer'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
const initialState = getInitialStateRenderer()
const store = createStore(
  reducer,
  initialState,
  compose(applyMiddleware(forwardToMain, thunk))
  // applyMiddleware(forwardToMain)
)
replayActionRenderer(store)


// play around with rethinkdb stuff in renderer process


// Provider will provide the redux store to 
// all components in the app
const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render( jsx, document.getElementById('root'))


const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

r.connect({
    host: dbHost,
    port: dbPort
  })
  .then(conn => {
    r.db(dbName).table(dbTableName)
      .run(conn)
      .then(results => {
        console.log(results)
      })
      .catch(err => {
        if (err) throw err
      })
  })
  .catch(err => {
    if (err) throw err
})