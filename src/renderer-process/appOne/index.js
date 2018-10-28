import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import '../../shared/styles/styles.scss'
import App from './components/App'
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../../shared/reducers/reducer'
import thunk from 'redux-thunk'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
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

console.log('hi from appOne/index.js')