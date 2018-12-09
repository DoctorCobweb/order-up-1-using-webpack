import _ from 'lodash'

const prioritiesDefaultState = {
  '1': '',
  '2': '',
  '3': '',
  '4': '',
  '5': '',
}

export default (state=prioritiesDefaultState, action) => {
  switch(action.type) {
    case 'SETUP_PRIORITIES':
      return action.payload.priorities
    case 'DELETE_PRIORITIES':
      return prioritiesDefaultState
    case 'SET_PRIORITY':
      return action.payload.priorities
    case 'REMOVE_ORDER_FROM_PRIORITIES':
      return action.payload.priorities
    default:
      return state
  }
}
