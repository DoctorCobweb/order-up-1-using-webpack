import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers/reducer'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'

export default() => {
  const store = createStore(
    reducer,
    compose(applyMiddleware(thunk, forwardToRenderer)) // IMPORTANT: forwardToRenderer goes last
    // applyMiddleware(forwardToRenderer) // IMPORTANT: this goes last
  )

  replayActionMain(store)

  return store
}