import { Order } from '../models/models'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'

const orderPopulation = {
  path: 'courses',
  model: 'Course',
  populate: {
      path: 'items',
      model: 'Item',
      populate: {
          path: 'infos',
          model: 'Info',
          populate: {
              path: 'infoLines',
              model: 'InfoLine'
          }
      }
  }
}

// ADD_ORDER
export const addOrder = (order) => ({
  type: 'ADD_ORDER',
  payload: order 
})

export const startAddOrder = (orderId = undefined) => {
  return (dispatch, getState) => {
    return Order.findById(orderId)
    .populate(orderPopulation)
    .exec() 
    .then(order => {
        console.log(colors.blue(stringify(order)))
        dispatch(addOrder(order._doc))
        // console.log(colors.green('ELECTRON-REDUX STORE'))
        // console.log(colors.blue(store.getState()))
    })
    .catch(err => {
      throw err
    })
  }
}



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