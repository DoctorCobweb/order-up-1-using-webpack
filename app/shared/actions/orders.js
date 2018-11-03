import { Order, Item, Info } from '../models/models'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'


// good stuff to use later
// 1. use mongo operators (here $inc) in options object:
// return Item.findByIdAndUpdate(itemId, { $inc: { quantity: amount } }, { new: true})
// 2.

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

export const updateItemQuantity = (orderId, courseId, itemId, amount, completed) => ({
  type: 'UPDATE_ITEM_QUANTITY',
  payload: {
    orderId,
    courseId,
    itemId,
    amount,
    completed
  }
})
// TRIAL VERSION
export const startUpdateItemQuantity = ({orderId, courseId, itemId, amount} = {}) => {
  return (dispatch, getState) => {
    return Item.findById(itemId)
      .exec()
      .then(item => {
        // console.log('updated Item document is:')
        // console.log(item)
        // console.log('updated item quantity. calling updateItemQuantity action')
        item.quantity += amount
        if (item.quantity <= 0) {
          // item is completed
          item.completed = true
        } else {
          item.completed = false
        }

        // now save the item to db
        return item.save()
      })
      .then(item => {
        dispatch(
          updateItemQuantity(
            orderId,
            courseId,
            itemId,
            amount,
            item.completed
          )
        )
      })
      .catch(err => {
        throw err
      })
  }
}


export const updateItemAndInfoQuantity = (orderId, courseId, itemId, infoId, amount, itemCompleted, infoCompleted) => ({
  type: 'UPDATE_ITEM_AND_INFO_QUANTITY',
  payload: {
    orderId,
    courseId,
    itemId,
    infoId,
    amount,
    itemCompleted,
    infoCompleted
  }
})

export const startUpdateItemAndInfoQuantity = ({orderId, courseId, itemId, infoId, amount} = {}) => {
  // need reference to item's completed field later on.
  // => when we call dispatch 
  let itemCompleted = false
  return (dispatch, getState) => {
    return Item.findById(itemId).exec()
    // return Item.findByIdAndUpdate(itemId, { $inc: { quantity: amount } }, { new: true })
      .then(item => {
        console.log('updated Item document is:')
        console.log(item)

        item.quantity += amount
        if (item.quantity <= 0) {
          itemCompleted = true
          item.completed = true
        } else {
          item.completed = false
        }

        return item.save()
      })
      .then(item => {
        // item has been updated and saved. now do the same for Info doc
        return Info.findById(infoId).exec()
      })
      .then(info => {
        info.quantity += amount
        if (info.quantity <= 0) {
          info.completed = true
        } else {
          info.completed = false
        }
        return info.save()
      })
      .then(info => {
        console.log('updated Info document is:')
        console.log(info)
        console.log('calling updateItemAndInfoQuantity action')
        dispatch(
          updateItemAndInfoQuantity(
            orderId,
            courseId,
            itemId,
            infoId,
            amount,
            itemCompleted,
            info.completed
          )
        )
      })
      .catch(err => {
        throw err
      })
  }
}

// export const startUpdateItemAndInfoQuantity = ({orderId, courseId, itemId, infoId, amount} = {}) => {
//   console.log('startUpdateItemAndInfoQuantity called. updating mongodb')
//   return (dispatch, getState) => {
//     return Item.findByIdAndUpdate(itemId, { $inc: { quantity: amount } }, { new: true })
//       .exec()
//       .then(item => {
//         console.log('updated Item document is:')
//         console.log(item)
//         return Info
//           .findByIdAndUpdate(infoId, { $inc: { quantity: amount } }, { new: true })
//           .exec()
//       })
//       .then((itemInfo) => {
//         console.log('updated Info document is:')
//         console.log(itemInfo)
//         console.log('calling updateItemAndInfoQuantity action')
//         dispatch(updateItemAndInfoQuantity(orderId, courseId, itemId, infoId, amount))
//       })
//       .catch(err => {
//         throw err
//       })
//   }
// }