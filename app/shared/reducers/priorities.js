import _ from 'lodash'

const prioritiesDefaultState = {
  first: '',
  second: '',
  third: '',
  fourth: '',
  fifth: '',
}

export default (state=prioritiesDefaultState, action) => {
  switch(action.type) {
    case 'SETUP_PRIORITIES':
      console.log('SETUP_PROPERTIES')
      console.log(action.payload.priorities)
      return action.payload.priorities
    case 'DELETE_PRIORITIES':
      console.log('deleting priorities from redux store')
      return prioritiesDefaultState
    case 'SET_PRIORITY':
      console.log('SET_PRIORITY, new priorities are')
      console.log(action.payload.priorities)
      return action.payload.priorities
    default:
      return state
  }
}
