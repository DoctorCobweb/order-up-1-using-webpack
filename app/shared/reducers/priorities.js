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
      console.log('hello from SETUP_PRIORITIES')
      // todo
      console.log('action.payload.prioritiesData.priorities')
      console.log(action.payload.prioritiesData.priorities)

      return action.payload.prioritiesData.priorities

    case 'DELETE_PRIORITIES':
      console.log('deleting priorities from redux store')
      return prioritiesDefaultState
    default:
      return state
  }
}
