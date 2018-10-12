import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../reducers/reducer'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'

export default() => {
  const store = createStore(
    reducer,
    applyMiddleware(forwardToRenderer) // IMPORTANT: this goes last
  )
  replayActionMain(store)

  return store
}