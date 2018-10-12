// orders reducer

const ordersReducerDefaultState = ['baz']

export default (state=ordersReducerDefaultState, action) => {
  switch(action.type) {
    case 'ADD_ORDER': 
      return [
        ...state,
        action.order
      ]
    default:
      return state
  }
}