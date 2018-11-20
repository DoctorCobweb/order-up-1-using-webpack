import { Order, Course, Item, Info, InfoLine } from '../models/order'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid


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

    // *** JETISON AWAY ***
export const addOrder = (order) => ({
  type: 'ADD_ORDER',
  payload: order 
})


    // *** JETISON AWAY ***
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

// *** JETTISON AWAY ***
export const updateItemQuantity = (
  orderId,
  courseId,
  itemId,
  amount,
  completed
  ) => ({
  type: 'UPDATE_ITEM_QUANTITY',
  payload: {
    orderId,
    courseId,
    itemId,
    amount,
    completed
  }
})

// *** JETTISON AWAY ***
export const startUpdateItemQuantity = ({
  orderId,
  courseId,
  itemId,
  amount
} = {}) => {
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

// *** JETTISON AWAY ***
export const updateItemAndInfoQuantity = (
  orderId,
  courseId,
  itemId,
  infoId,
  amount,
  itemCompleted,
  infoCompleted
  ) => ({
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

// *** JETTISON AWAY ***
export const startUpdateItemAndInfoQuantity = ({
  orderId,
  courseId,
  itemId,
  infoId,
  amount
} = {}) => {
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

// *** JETISON AWAY ***
export const updateInfoLine = (
  orderId,
  courseId,
  itemId,
  infoId,
  infoLineId,
  quantity,
  name,
) => ({
  type: 'UPDATE_INFOLINE',
  payload: {
    orderId,
    courseId,
    itemId,
    infoId,
    infoLineId,
    quantity,
    name
  }
})

// *** JETISON AWAY ***
// cb: is a callback which in its body calls this.setState()
// to reset the state back to its defaults (not all of state's properties, though)
export const startUpdateInfoLine = ({
  orderId,
  courseId,
  itemId,
  infoId,
  infoLineId,
  quantity,
  name,
} = {}, cb) => {
  return (dispatch, getState) => {
    return InfoLine.findById(infoLineId).exec()
    .then(infoLine => {
      infoLine.quantity = quantity
      infoLine.name = name 
      return infoLine.save()
    })
    .then(infoLine => {
      console.log('updated InfoLine document is:')
      console.log(infoLine)
      console.log('calling updateInfoLine action')
      dispatch(updateInfoLine(
        orderId,
        courseId,
        itemId,
        infoId,
        infoLineId,
        quantity,
        name,
      ))
      cb()
    })
    .catch(err => {
      throw err
    })
  }
}

// *** JETISON AWAY ***
export const addNewInfoLine = (
  orderId,
  courseId,
  itemId,
  infoId,
  newInfoLineId,
  newInfoLineQuantity,
  newInfoLineName,
) => ({
  type: 'ADD_NEW_INFOLINE',
  payload: {
    orderId,
    courseId,
    itemId,
    infoId,
    newInfoLineId,
    newInfoLineQuantity,
    newInfoLineName,
  }
})

// *** JETISON AWAY ***
// cb: is a callback which in its body calls this.setState()
// to reset the state back to its defaults (not all of state's properties, though)
export const startAddNewInfoLine = ({
  orderId,
  courseId,
  itemId,
  infoId,
  quantity,
  name,
} = {}, cb) => {
  let newInfoLineId
  return (dispatch, getState) => {
    const infoLine = new InfoLine({
      _id: uuidv1(),
      name,
      quantity
    })
    return infoLine.save()
    .then(infoLine => {
      console.log('created and saved a new InfoLine document')
      console.log(infoLine)
      newInfoLineId = infoLine._id
      return Info.findById(infoId).exec()
    })
    .then(info => {
      console.log('appending the new InfoLine doc which has _id')
      console.log(newInfoLineId)
      console.log('to info')
      info.infoLines.push(newInfoLineId)

      return info.save()
    })
    .then(info => {
      console.log('saved the info with a new InfoLine attached:')
      console.log(info)
      dispatch(addNewInfoLine(
        orderId,
        courseId,
        itemId,
        infoId,
        newInfoLineId,
        quantity,
        name
      ))
      cb()
    })
    .catch(err => {
      throw err
    })
  }
}

    // *** JETISON AWAY ***
export const addNewInfo = (
  courseId,
  orderId,
  itemId,
  newInfo,
  quantity
) => ({
  type: 'ADD_NEW_INFO',
  payload: {
    courseId,
    orderId,
    itemId,
    newInfo,
    quantity
  }
})

    // *** JETISON AWAY ***
export const startAddNewInfo = ({
  orderId,
  courseId,
  itemId,
  quantity,
  name
} = {}, cb) => {
  let newInfo
  let newInfoLine 

  return (dispatch, getState) => {
    const infoLine = new InfoLine({
      _id: uuidv1(),
      name,
      quantity: 1 //default for now
    })
    return infoLine.save()
    .then(infoLine => {
      console.log('created and saved a new InfoLine document')
      console.log(infoLine.toJSON())

      newInfoLine = infoLine.toJSON()

      const info = new Info({
        _id: uuidv1(),
        completed: false,
        quantity,
        infoLines: [infoLine._id]
      })
      return info.save()
    })
    .then(info => {
      console.log('created and saved a new Info document')
      console.log(info.toJSON())
      // and also append the new info doc _id to the corresponding
      // item infos array
      newInfo = info.toJSON()
      newInfo.infoLines = [ newInfoLine ] // infoLines must be an array
      return Item.findById(itemId).exec()
    })
    .then(item => {
      console.log('found item doc. appending infos array with new info _id')
      console.log(item.toJSON())

      // update the infos array
      item.infos.push(newInfo._id)

      return item.save()
    })
    .then(item => {
      console.log('updated the new item document')
      console.log(item.toJSON())
      console.log('newInfo is')
      console.log(newInfo)

      // now call dispatch
      console.log('calling dispatch(addNewInfo())')
      dispatch(addNewInfo(
        courseId,
        orderId,
        itemId,
        newInfo,
        quantity
      ))
      cb()
    })
    .catch(err => {
      throw err
    })
  }
}


    // *** JETISON AWAY ***
export const setOrders = (orders) => ({
  type: 'SET_ORDERS',
  payload: {
    orders
  }
})

    // *** JETISON AWAY ***
export const startSetOrders = () => {
  return (dispatch, getState) => {
    console.log('hello from startSetOrders@')

    return Order.find({ list: 'new-orders'}) 
      .populate(orderPopulation)
      .exec()
      .then(orders => {
        const ordersCleanedUp = _.map(orders, order => order.toJSON())
        console.log(`found all orders in mongodb. orders.length=${ordersCleanedUp.length}`)
        dispatch(setOrders(ordersCleanedUp))
      })
      .catch(err => {
        throw err
      })
  }
}

// *** JESTISON AWAY ****
export const toggleGoOnMains = (orderId, goOnMainsBool, timestamp) => ({
  type: 'TOGGLE_GO_ON_MAINS',
  payload: {
    orderId,
    goOnMainsBool,
    timestamp,
  }
})

// *** JESTISON AWAY ****
export const startToggleGoOnMains = ({ orderId, timestamp } = {}) => {
  let updatedGoOnMainsBool
  return (dispatch, getState) => {
    // find the order using orderId, updated the goOnMains field to goOnMains arg 
    return Order.findById(orderId).exec()
    .then(order => {
      updatedGoOnMainsBool = !order.goOnMains
      order.goOnMains = updatedGoOnMainsBool
      order.goOnMainsStartedAt = timestamp
      return order.save()
    })
    .then(order => {
      console.log('updated order goOnMains')
      console.log(order.toJSON())
      dispatch(toggleGoOnMains(orderId, updatedGoOnMainsBool, timestamp))
    })
    .catch(err => {
      throw err
    })
  }
}

// *** JESTISON AWAY ****
export const deleteAllOrders = () => ({
  type: 'DELETE_ALL_ORDERS',
  payload: {}
})

// *** JESTISON AWAY ****
// TODO: learn more about change streams and removing collections
//       when watchers are present on the collection
// deleting all the documents from all the collections.
// we won't lose the collections, just their count will be 0.
// this is important because we have change stream watchers for
// collection (s) and at this stage of development, im not sure
// what will happen if you pull the proverbial rug out from underneath
// the watcher's feet.
export const startDeleteAllOrders = () => {
  return (dispatch, getState) => {
    return InfoLine.deleteMany({}).exec()
    .then(() => {
      console.log('deleted all docs in InfoLine collection')
      return Info.deleteMany({}).exec()
    })
    .then(() => {
      console.log('deleted all docs in Info collection')
      return Item.deleteMany({}).exec()
    })
    .then(() => {
      console.log('deleted all docs in Item collection')
      return Course.deleteMany({}).exec()
    })
    .then(() => {
      console.log('deleted all docs in Course collection')
      return Order.deleteMany({}).exec()
    })
    .then(()=> {
      console.log('calling dispatch to delete all of its order state')
      dispatch(deleteAllOrders())
    })
    .catch(err => {
      throw err
    })
  }
}