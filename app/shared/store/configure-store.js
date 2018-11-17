import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import listsReducer from '../reducers/lists'
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'


// TODO: make this file the single location for setting up the store.
// => both main and renderer processes use this file to setup their corresponding stores.
//
// atm, it's just the main process store setup here!

export default() => {
  const store = createStore(
    combineReducers({
      lists: listsReducer
    }),
    compose(applyMiddleware(thunk, forwardToRenderer)) // IMPORTANT: forwardToRenderer goes last
  )

  replayActionMain(store)

  return store
}