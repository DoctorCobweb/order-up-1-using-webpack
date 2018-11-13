import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'

const boardReducerDefaultState = []

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