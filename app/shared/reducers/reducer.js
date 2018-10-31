import _ from 'lodash'
// orders reducer

const ordersReducerDefaultState = []

export default (state=ordersReducerDefaultState, action) => {
  switch(action.type) {
    case 'ADD_ORDER': 
      return [
        ...state,
        action.payload
      ]
    // TODO
    // case 'UPDATE_ITEM_QUANTITY':
    //   return state.map(order => {
    //     if (order._id === action.payload.orderId) {
    //         // find the item in the order using
    //         // action.payload.itemId
    //         return _.map(order, course => {

    //         })

    //     } else {
    //       return order
    //     }
    //   })
    default:
      return state
  }
}