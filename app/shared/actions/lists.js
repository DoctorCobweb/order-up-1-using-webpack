import moment from 'moment'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid
import { Order, Course, Item, Info, InfoLine } from '../models/order'
import { List } from '../models/list'

const NUMBER_OF_LISTS = 2


// startSetupLists/ setupLists should populate a state object like this.
// populate orders: {with all orders in db that are in the new-orders lists => list='new-orders'}
// const listsReducerDefaultState = {
//   completedOrders: {
//     '_id-x': { id: '_id-x', content: 'orderx'},
//     '_id-y': { id: '_id-y', content: 'ordery'},
//     '_id-z': { id: '_id-z', content: 'orderz'},
//   },
//   orders: {
//     '_id-1': { id: '_id-1', content: 'order1'},
//     '_id-2': { id: '_id-2', content: 'order2'},
//     '_id-3': { id: '_id-3', content: 'order3'},
//     '_id-4': { id: '_id-4', content: 'order4'},
//   },
//   lists: {
//     'new-orders': {
//       _id: 'abc1',
//       nameId: 'new-orders',
//       title: 'NEW ORDERS',
//       direction: 'horizontal',
//       orderIds: ['_id-1', '_id-2', '_id-3', '_id-4'],
//     },
//     'completed-orders': {
//       _id: 'abc4',
//       nameId: 'completed-orders',
//       title: 'Completed Orders',
//       direction: 'vertical',
//       orderIds: [],
//     },
//   },
//   // faciliatate reordering of the orders ? 
//   listOrder: ['new-orders', 'completed-orders'],
// }

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

export const setupLists = (listsData) => ({
  type: 'SETUP_LISTS',
  payload: {
    listsData
  }
})

const createTheListsInMongo = () => {
  let newOrdersForListData
  let completedOrdersForListData
  let mongoLists = []
  let newOrdersList
  // creating the lists means we're starting the app totally fresh.
  // that is, all orders in db should be allocated to the 'new-orders' list
  // => so get all orders and put them in the 'new-orders' list
  return Order.find({ completed: false }) 
    .populate(orderPopulation)
    .exec()
    .then(orders => {
      newOrdersForListData = _.reduce(orders, (acc, order) => {
        acc[order._id] = { id: order._id, content: order.toJSON()}
        return acc
      }, {})

      const newOrdersList = new List({
        _id: uuidv1(),
        nameId: 'new-orders',
        title: 'NEW ORDERS',
        direction: 'horizontal',
        orderIds: [...Object.keys(newOrdersForListData)],
      })

      return List.create(newOrdersList)
    })
    .then(list => {
      mongoLists.push(list)
      return Order.find({ completed: true})
        .populate(orderPopulation)
        .exec()
    })
    .then(completedOrders => {
      completedOrdersForListData = _.reduce(completedOrders, (acc, order) => {
        acc[order._id] = { id: order._id, content: order.toJSON()}
        return acc
      }, {})

      const completedList = new List({
        _id: uuidv1(),
        nameId: 'completed-orders',
        title: 'COMPLETED ORDERS',
        direction: 'vertical',
        orderIds: [...Object.keys(completedOrdersForListData)],
      })
      return List.create(completedList)
    })
    .then(completedOrdersList => {
      mongoLists.push(completedOrdersList)
      const listsData = {}
      listsData.orders = newOrdersForListData
      listsData.completedOrders = completedOrdersForListData
      listsData.listOrder = ['new-orders', 'completed-orders']
      listsData.lists = _.reduce(mongoLists, (acc, list) => {
        acc[list.nameId] = list.toJSON()
        return acc
      }, {})

      // IT SHOULD LOOK LIKE THIS:
      // listsData.lists = {
      //   'new-orders': {
      //     _id: 'abc1',       
      //     nameId: 'new-orders',
      //     title: 'NEW ORDERS',
      //     direction: 'horizontal',
      //     orderIds: ['abc', 'abbbcc',...],
      //   },
      //   'completed': {
      //     _id: 'abc4',       
      //     nameId: 'completed',
      //     title: 'Completed Orders',
      //     direction: 'vertical',
      //     orderIds: [],
      //   },
      // }
      return listsData
    })
    .catch(err => {
      throw err
    })
}

const getTheListsInMongo = () => {
  const listsData = {}
  let ordersForListData 
  let completedOrdersForListData
  return Order.find({ completed: false }) 
    .populate(orderPopulation)
    .exec()
    .then(orders => {
      ordersForListData = _.reduce(orders, (acc, order) => {
        acc[order._id] = {id: order._id, content: order.toJSON()}
        return acc
      }, {})

      // TODO
      // *** DIDNT HAVE .exec() here and it apparently worked. weird.
      // => check this out later
      return List.find({}).exec()
    })
    .then(lists => {
      listsData.orders = ordersForListData
      // default for now to hard-coding listOrder. maybe change later
      // to allow lists to move around
      listsData.listOrder = ['new-orders', 'completed-orders']
      listsData.lists = _.reduce(lists, (acc, list) => {
        acc[list.nameId] = list.toJSON()
        return acc
      }, {})

      // IT SHOULD LOOK LIKE THIS:
      // listsData.lists = {
      //   'new-orders': {
      //     _id: 'abc1',       
      //     nameId: 'new-orders',
      //     title: 'NEW ORDERS',
      //     direction: 'horizontal',
      //     orderIds: ['abc', 'abbbcc',...],
      //   },
      //   'completed-orders': {
      //     _id: 'abc4',       
      //     nameId: 'completed-orders',
      //     title: 'Completed Orders',
      //     direction: 'vertical',
      //     orderIds: [],
      //   },
      // }

      return Order.find({ completed: true })
        .populate(orderPopulation)
        .exec()
    })
    .then(completedOrders => {
      completedOrdersForListData = _.reduce(completedOrders, (acc, order) => {
        acc[order._id] = {id: order._id, content: order.toJSON()}
        return acc
      }, {})

      listsData.completedOrders = completedOrdersForListData
      return listsData
    })
    .catch(err => {
      throw err
    })
}

export const startSetupLists = () => {
  return (dispatch, getState) => {
    List.countDocuments().exec()
      .then(count => {
        // there are 2 lists, only should only ever be 4. they correspond to:
        // 1. new-orders
        // 2. completed-orders
        if (count === NUMBER_OF_LISTS) {
          // already have the lists setup
          return getTheListsInMongo()
        } else {
          // no lists present. we need to set them up
          return createTheListsInMongo()
        }
      })
      .then(listsData => {
        dispatch(setupLists(listsData))
      })
      .catch(err => {
        throw err
      })
  }
}

export const updateOrderIdsInList = (data) => ({
  type: 'UPDATE_ORDER_IDS_IN_LIST',
  payload: {
    data,
  }
})

export const startUpdateOrderIdsInList = (dndData) => {
  return (dispatch, getState) => {
    return List.findOneAndUpdate(
      { nameId: 'new-orders' },
      { orderIds: dndData.lists['new-orders'].orderIds }).exec()
    .then(list => {
      dispatch(updateOrderIdsInList(dndData))
    })
    .catch(err => {
      throw err
    })
  }
}

export const addOrderToList = (order) => ({
  type: 'ADD_ORDER_TO_LIST',
  payload: {
    order,
  }
})

export const startAddOrderToList = (orderId) => {
  let newOrder
  return (dispatch, getState) => {
    return Order.findById(orderId)
      .populate(orderPopulation)
      .exec()
      .then(order => {
        newOrder = order.toJSON()
        return List.find({ nameId: 'new-orders'}).exec()
      })
      .then(list => {
        const [ newOrdersList ] = list
        newOrdersList.orderIds.push(newOrder._id)
        return newOrdersList.save()
      })
      .then(newOrdersList => {
        dispatch(addOrderToList(newOrder))
      })
      .catch(err => {
        throw err
      })
  }
}

export const setOrderAsCompleted = (orderId) => ({
  type: 'SET_ORDER_AS_COMPLETED',
  payload: {
    orderId,
  }
})

export const startSetOrderAsCompleted = ({ orderId }) => {
  return (dispatch, getState) => {
    // we dont need to populate it, as completed field is in Order model
    // and not a subdocument
    return Order.findById(orderId)
      .exec()
      .then(order => {
        order.completed = true
        order.list = 'completed-orders'
        order.priority = false
        return order.save()
      })
      .then(order => {
        // have to remove it from orderIds array in new-orders orderIds array
        return List.findOne({ nameId: 'new-orders'}).exec()
      })
      .then(list => {
        const deleteIndex = list.orderIds.indexOf(orderId)
        list.orderIds.splice(deleteIndex, 1)
        return list.save()
      })
      .then(list => {
        return List.findOne({ nameId: 'completed-orders'}).exec()
      })
      .then(list => {
        list.orderIds.push(orderId)
        return list.save()
      })
      .then(list => {
        dispatch(setOrderAsCompleted(orderId))
      })
      .catch(err => {
        throw err
      })
  }
}

export const addOrderBackToNewOrdersList = (orderId) => ({
  type: 'ADD_ORDER_BACK_TO_NEW_ORDERS_LIST',
  payload: { orderId }
})

export const startAddOrderBackToNewOrdersList = (orderId, cb) => {
  return (dispatch, getState) => {
    return Order.findById(orderId)
      .exec()
      .then(order => {
        // update the order
        order.completed = false
        order.list = 'new-orders'
        return order.save()
      })
      .then(order => {
        // update the completed-orders orderIds array
        return List.findOne({ nameId: 'completed-orders' }).exec()
      })
      .then(list => {
        // remove the orderId from completedList's orderIds array
        // const orderIdsClone = _.cloneDeep(list.orderIds)
        const orderIndex = list.orderIds.indexOf(orderId)
        list.orderIds.splice(orderIndex, 1)
        return list.save()
      })
      .then(list => {
        // update the new-orders orderIds array
        return List.findOne({ nameId: 'new-orders' }).exec()
      })
      .then(list => {
        // take the orderId on at the end of orderIds
        // => will show up at the bottom of NEW ORDERS list in UI
        list.orderIds.push(orderId)
        return list.save()
      })
      .then(list => {
        // dispatch to redux now
        dispatch(addOrderBackToNewOrdersList(orderId, cb))
        // for UI confirmation/guidance/redirection
        cb()
      })
      .catch(err => {
        throw err
      })
  }
}

export const setToggleOrderAsPriority = (orderId) => ({
  type: 'TOGGLE_ORDER_AS_PRIORITY',
  payload: { orderId }
})

export const startSetToggleOrderAsPriority = ({ orderId }) => {
  return (dispatch, getState) => {
    return Order.findById(orderId)
      .exec()
      .then(order => {
        // update the order
        order.priority = !order.priority
        return order.save()
      })
      .then(order => {
        return dispatch(setToggleOrderAsPriority(orderId))
      })
      .catch(err => {
        throw err
      })
  }
}

////////////////////////////////////////////////////////////
//
// ORDER-ORIENTED ACTIONS: FROM order.js actions.....
//
////////////////////////////////////////////////////////////

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
      // and also append the new info doc _id to the corresponding
      // item infos array
      newInfo = info.toJSON()
      newInfo.infoLines = [ newInfoLine ] // infoLines must be an array
      return Item.findById(itemId).exec()
    })
    .then(item => {

      // update the infos array
      item.infos.push(newInfo._id)

      return item.save()
    })
    .then(item => {

      // now call dispatch
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
      .then(item => {

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
      newInfoLineId = infoLine._id
      return Info.findById(infoId).exec()
    })
    .then(info => {
      info.infoLines.push(newInfoLineId)

      return info.save()
    })
    .then(info => {
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

export const deleteAllOrders = () => ({
  type: 'DELETE_ALL_ORDERS',
  payload: {}
})

// TODO: learn more about change streams and removing collections
//       when watchers are present on the collection
// deleting all the documents from all the collections.
// we won't lose the collections, just their count will be 0.
// this is important because we have change stream watchers for
// collection (s) and at this stage of development, im not sure
// what will happen if you pull the proverbial rug out from underneath
// the watcher's feet.
export const startDeleteAllOrders = () => {

  // 1. mongo stuff: delete all of collections:
  // orders, courses, items, infos, infolines, lists
  //
  // 2. reset redux state to default

  return (dispatch, getState) => {
    return InfoLine.deleteMany({}).exec()
    .then(() => {
      return Info.deleteMany({}).exec()
    })
    .then(() => {
      return Item.deleteMany({}).exec()
    })
    .then(() => {
      return Course.deleteMany({}).exec()
    })
    .then(() => {
      return Order.deleteMany({}).exec()
    })
    .then(() => {
      return List.deleteMany({}).exec()
    })
    .then(() => {
      return createTheListsInMongo()
    })
    .then(()=> {

      dispatch(deleteAllOrders())
    })
    .catch(err => {
      throw err
    })
  }
}

export const toggleGoOnMains = (orderId, goOnMains, goOnMainsStartedAt) => ({
  type: 'TOGGLE_GO_ON_MAINS',
  payload: {
    orderId,
    goOnMains,
    goOnMainsStartedAt,
  }
})

export const startToggleGoOnMains = ({ orderId } = {}) => {
  return (dispatch, getState) => {
    return Order.findById(orderId).exec()
    .then(order => {
      if (order.goOnMains) {
        // before toggling db values, goOnMains is already true.
        // toggling the button will want to change this to false
        // => want to hold mains, so
        // we should NOT go on mains
        // => set values to false and null
        order.goOnMains = false
        order.goOnMainsStartedAt = null
      } else {

        // order has been holding on mains and now user
        // want to go on mains
        // => set values to true and set a timestamp
        order.goOnMains = true
        order.goOnMainsStartedAt = moment() 
      }
      return order.save()
    })
    .then(order => {
      dispatch(toggleGoOnMains(orderId, order.goOnMains, order.goOnMainsStartedAt))
    })
    .catch(err => {
      throw err
    })
  }
}