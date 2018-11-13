import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import ordersReducer from '../reducers/orders'
import boardReducer from '../reducers/board'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'

export default() => {
  const store = createStore(
    combineReducers({
      orders: ordersReducer,
      board: boardReducer
    }),
    compose(applyMiddleware(thunk, forwardToRenderer)) // IMPORTANT: forwardToRenderer goes last
  )

  replayActionMain(store)

  return store
}