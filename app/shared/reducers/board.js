import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'

// TODO: different default state data structure?
const boardReducerDefaultState = []

// the 'state' here is the board slice (you don't have to do this: state.board)
export default (state=boardReducerDefaultState, action) => {
  switch(action.type) {

    case 'ADD_ORDER_TO_BOARD': 
      // TODO
      // return [
      //   ...state,
      //   action.payload
      // ]
      return state

    default:
    return state
  }
}