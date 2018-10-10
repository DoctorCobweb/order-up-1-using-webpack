// orders reducer

export default (state=[], action) => {
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