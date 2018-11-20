import moment from 'moment'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid
import { Order, Course, Item, Info, InfoLine } from '../models/order'
import { List } from '../models/list'


// startSetupLists/ setupLists should populate a state object like this.
// populate orders: {with all orders in db that are in the new-orders lists => list='new-orders'}
// const listsReducerDefaultState = {
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
//       direction: 'vertical',
//       orderIds: ['_id-1', '_id-2', '_id-3', '_id-4'],
//     },
//     'board-a': {
//       _id: 'abc2',
//       nameId: 'board-a',
//       title: 'BOARD A',
//       direction: 'horizontal',
//       orderIds: [],
//     },
//     'board-b': {
//       _id: 'abc3',
//       nameId: 'board-b',
//       title: 'BOARD B',
//       direction: 'horizontal',
//       orderIds: [],
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
//   listOrder: ['new-orders', 'board-a', 'board-b', 'completed-orders'],
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
  let mongoLists
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
        direction: 'vertical',
        orderIds: [...Object.keys(newOrdersForListData)],
      })

      const boardListA = new List({
        _id: uuidv1(),
        nameId: 'board-a',
        title: 'BOARD A',
        direction: 'horizontal',
        orderIds: [],
      })

      const boardListB = new List({
        _id: uuidv1(),
        nameId: 'board-b',
        title: 'BOARD B',
        direction: 'horizontal',
        orderIds: [],
      })

      return (
        List.insertMany([
          newOrdersList,
          boardListA,
          boardListB
        ])
      )
    })
    .then(lists => {
      mongoLists = lists
      return Order.find({ completed: true})
        .populate(orderPopulation)
        .exec()
    })
    .then(newOrders => {
      completedOrdersForListData = _.reduce(newOrders, (acc, order) => {
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
      listsData.listOrder = ['new-orders', 'board-a', 'board-b', 'completed-orders']
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
      //     direction: 'vertical',
      //     orderIds: ['abc', 'abbbcc',...],
      //   },
      //   'board-a': {
      //     _id: 'abc2',       
      //     nameId: 'board-a',
      //     title: 'BOARD A',
      //     direction: 'horizontal',
      //     orderIds: [],
      //   },
      //   'board-b': {
      //     _id: 'abc3',       
      //     nameId: 'board-b',
      //     title: 'BOARD B',
      //     direction: 'horizontal',
      //     orderIds: [],
      //   },
      //   'completed': {
      //     _id: 'abc4',       
      //     nameId: 'completed',
      //     title: 'Completed Orders',
      //     direction: 'vertical',
      //     orderIds: [],
      //   },
      // }
      console.log('listsData')
      console.log(listsData)
      return listsData
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
      // console.log('here are the false completed orders')
      // console.log(orders)
      ordersForListData = _.reduce(orders, (acc, order) => {
        acc[order._id] = {id: order._id, content: order.toJSON()}
        return acc
      }, {})
      return List.find({})
    })
    .then(lists => {
      listsData.orders = ordersForListData
      // default for now to hard-coding listOrder. maybe change later
      // to allow lists to move around
      listsData.listOrder = ['new-orders', 'board-a', 'board-b', 'completed-orders']
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
      //     direction: 'vertical',
      //     orderIds: ['abc', 'abbbcc',...],
      //   },
      //   'board-a': {
      //     _id: 'abc2',       
      //     nameId: 'board-a',
      //     title: 'BOARD A',
      //     direction: 'horizontal',
      //     orderIds: [],
      //   },
      //   'board-b': {
      //     _id: 'abc3',       
      //     nameId: 'board-b',
      //     title: 'BOARD B',
      //     direction: 'horizontal',
      //     orderIds: [],
      //   },
      //   'completed-orders': {
      //     _id: 'abc4',       
      //     nameId: 'completed-orders',
      //     title: 'Completed Orders',
      //     direction: 'vertical',
      //     orderIds: [],
      //   },
      // }
      // console.log('listsData')
      // console.log(listsData)

      return Order.find({ completed: true })
        .populate(orderPopulation)
        .exec()
    })
    .then(completedOrders => {
      // console.log('here are the completed orders')
      // console.log(completedOrders)
      completedOrdersForListData = _.reduce(completedOrders, (acc, order) => {
        acc[order._id] = {id: order._id, content: order.toJSON()}
        return acc
      }, {})

      listsData.completedOrders = completedOrdersForListData

      console.log('listsData')
      console.log(listsData)

      return listsData
    })
}

export const startSetupLists = () => {
  console.log('heeloofrom startSetupLists')
  return (dispatch, getState) => {
    List.countDocuments().exec()
      .then(count => {

        // there are 4 lists, only should only ever be 4. they correspond to:
        // 1. new-orders
        // 2. board-a
        // 3. board-b
        // 4. completed-orders
        if (count === 4) {
          // already have the lists setup
          console.log('already have lists setup. get them all from mongodb & setup data for lists-state')
          return getTheListsInMongo()
        } else {
          // no lists present. we need to set them up
          console.log('no lists setup in mongo. create them & setup data for lists-state')
          return createTheListsInMongo()
        }
      })
      .then(listsData => {
        console.log('calling dispatch setupLists with listsData:')
        console.log(listsData)
        dispatch(setupLists(listsData))
      })
      .catch(err => {
        throw err
      })
  }
}

export const updateOrderIdsInLists = (data) => ({
  type: 'UPDATE_ORDER_IDS_IN_LISTS',
  payload: {
    data,
  }
})

export const startUpdateOrderIdsInLists = (dndData) => {
  return (dispatch, getState) => {
    console.log('startUpdateLists, dndData is:')
    console.log(dndData)

    return List.findOneAndUpdate(
      { nameId: 'new-orders'},
      { orderIds: dndData.lists['new-orders'].orderIds }).exec()
    .then(list => {
      return List.findOneAndUpdate(
        { nameId: 'board-a'},
        { orderIds: dndData.lists['board-a'].orderIds }).exec()
    })
    .then(list => {
      return List.findOneAndUpdate(
        { nameId: 'board-b'},
        { orderIds: dndData.lists['board-b'].orderIds }).exec()
    })
    .then(list => {
      return List.findOneAndUpdate(
        { nameId: 'completed-orders'},
        { orderIds: dndData.lists['completed-orders'].orderIds }).exec()
    })
    .then(list => {
      dispatch(updateOrderIdsInLists(dndData))
    })
  }
}

export const addOrderToLists = (order) => ({
  type: 'ADD_ORDER_TO_LISTS',
  payload: {
    order,
  }
})

export const startAddOrderToLists = (orderId) => {
  let newOrder
  return (dispatch, getState) => {
    return Order.findById(orderId)
      .populate(orderPopulation)
      .exec()
      .then(order => {
        // console.log('startAddOrderToLists(). order is')
        // console.log(order)
        newOrder = order.toJSON()
        return List.find({ nameId: 'new-orders'}).exec()
      })
      .then(list => {
        console.log('list is')
        console.log(list)
        const [ newOrdersList ] = list

        newOrdersList.orderIds.push(newOrder._id)
        return newOrdersList.save()
      })
      .then(newOrdersList => {
        dispatch(addOrderToLists(newOrder))
      })
      .catch(err => {
        throw err
      })
  }
}

export const setOrderAsCompleted = (orderId, listNameId) => ({
  type: 'SET_ORDER_AS_COMPLETED',
  payload: {
    orderId,
    listNameId,
  }
})

export const startSetOrderAsCompleted = ({ orderId }) => {
  let listNameIdToDeleteOrderIdFrom
  return (dispatch, getState) => {
    // we dont need to populate it, as completed field is in Order model
    // and not a subdocument
    return Order.findById(orderId)
      .exec()
      .then(order => {
        order.completed = true
        return order.save()
      })
      .then(order => {
        // have to remove it from orderIds array in whatever list
        // contains that orderIds array..
        return List.find({orderIds: order._id}).exec()
      })
      .then(list => {
        // there orderId should only appear in ONE LIST by design.
        // we assume that this is always the case.
        const [ listContainingOrderId ] = list
        listNameIdToDeleteOrderIdFrom = listContainingOrderId.nameId
        const deleteIndex = listContainingOrderId.orderIds.indexOf(orderId)
        listContainingOrderId.orderIds.splice(deleteIndex, 1)
        return listContainingOrderId.save()
      })
      .then(list => {
        return List.findOne({ nameId: 'completed-orders'}).exec()
      })
      .then(list => {
        list.orderIds.push(orderId)
        return list.save()
      })
      .then(list => {
        dispatch(setOrderAsCompleted(orderId, listNameIdToDeleteOrderIdFrom))
      })
  }
}

////////////////////////////////////////////////////////////
//
// FROM order.js actions.....
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
    .then(() => {
      console.log('deleted all docs in Order collection')
      return List.deleteMany({}).exec()
    })
    .then(() => {
      return createTheListsInMongo()
    })
    .then(()=> {
      console.log('deleted all docs in List collection')
      console.log('calling dispatch to reset state.lists')

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
      console.log('updated order goOnMains')
      console.log(order.toJSON())
      dispatch(toggleGoOnMains(orderId, order.goOnMains, order.goOnMainsStartedAt))
    })
    .catch(err => {
      throw err
    })
  }
}