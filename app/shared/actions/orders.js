import { Order, Item } from '../models/models'
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
        // console.log(colors.blue(stringify(order)))
        console.log(colors.blue('ACTION: startAddOrder() => populated the order, adding to store'))

        // IMPORTANT: must call .toJSON() on the document. 
        // https://github.com/Automattic/mongoose/issues/516
        // if you don't then order object will contain many extra
        // properties, and look like
        // { '_doc':... ,
        //   '_activePaths': ... ,
        //   '_saveError': ... ,
        //   '_validationError: ... ,
        //   'isNew': ... ,
        //   '_pres': ... ,
        //   '_posts': ... ,
        //   'save': ... ,
        //   'errors': ... ,
        //   '_events': ...
        // }
        // you get the picture! the actual data we want resides in _doc field
        // and calling .toJSON() will give us just that.
        dispatch(addOrder(order.toJSON()))
    })
    .catch(err => {
      throw err
    })
  }
}



// UPDATE_ORDER
// export const updateOrder = (_id, updatedOrder) => ({
//   type: 'UPDATE_ORDER',
//   payload: updatedOrder
// })

// async UPDATE_ORDER
// because electron-redux turns all actions into async actions
// we must use appropriate middleware to handle async, eg redux-thunk
// export const startUpdateOrder = (_id, updatedOrder) => {
//   return (dispatch, getState) => {
//     return dispatch(updateOrder(_id, updatedOrder))
//   }
// }

export const updateItemQuantity = (orderId, courseId, itemId, amount) => ({
  type: 'UPDATE_ITEM_QUANTITY',
  payload: {
    orderId,
    courseId,
    itemId,
    amount
  }
})

export const startUpdateItemQuantity = ({orderId, courseId, itemId, amount} = {}) => {
  console.log('startUpdateItemQuantity called. updating mongodb')
  return (dispatch, getState) => {
    return Item.findByIdAndUpdate(itemId, { $inc: { quantity: amount } }, { new: true})
      .exec()
      .then(item => {
        console.log('updated document is:')
        console.log(item)
        console.log('updated item quantity. calling updateItemQuantity')
        dispatch(updateItemQuantity(orderId, courseId, itemId, amount))
      })
      .catch(err => {
        throw err
      })
  }
}

// export const updateItemInfo = (_id, updates) => ({
//   type: 'UPDATE_ITEM_INFO',
//   payload: updates
// })

// export const startUpdateItemInfo = (_id, updates) => {
//   return (dispatch, getState) => {
//     // update mongo Item corresponding to _id val pass in
//     Item.findByIdAndUpdate(_id, updates)
//       .exec()
//       .then(item => {
//         //call dispatch now 
//         dispatch(updateItemInfo(_id, updates))
//       })
//       .catch(e => {
//         throw e
//       })
//   }
// }