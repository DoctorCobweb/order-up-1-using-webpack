// ADD_ORDER
export const addOrder = (order) => ({
  type: 'ADD_ORDER',
  payload: order 
})

// UPDATE_ORDER
export const updateOrder = (id, updatedOrder) => ({
  type: 'UPDATE_ORDER',
  payload: updatedOrder
})


// async UPDATE_ORDER
// because electron-redux turns all actions into async actions
// we must use appropriate middleware to handle async, eg redux-thunk
export const startUpdateOrder = (id, updatedOrder) => {
  return (dispatch, getState) => {
    return dispatch(updateOrder(id, updatedOrder))
  }
}