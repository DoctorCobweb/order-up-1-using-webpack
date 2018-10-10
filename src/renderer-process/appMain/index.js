import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'

import { createStore, applyMiddleware } from 'redux'
import reducer from '../../main-process/reducers/reducer'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
const initialState = getInitialStateRenderer()
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(forwardToMain)
)
replayActionRenderer(store)

console.log(store.getState())

ReactDOM.render( <App/>, document.getElementById('root'))

console.log('hi from appMain/index.js')