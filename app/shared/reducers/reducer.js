// orders reducer

const ordersReducerDefaultState = []

export default (state=ordersReducerDefaultState, action) => {
  switch(action.type) {
    case 'ADD_ORDER': 
      return [
        ...state,
        action.payload
      ]
    case 'UPDATE_ORDER': // TODO: implement updating properly
      return [
        ...state,
        action.payload
      ]
    default:
      return state
  }
}