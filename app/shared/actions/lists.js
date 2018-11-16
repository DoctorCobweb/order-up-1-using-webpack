import { Order, Course, Item, Info, InfoLine } from '../models/order'
import { List } from '../models/list'
import stringify from 'json-stringify-pretty-compact'
import colors from 'colors'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid


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
//   },
//   // faciliatate reordering of the orders ? 
//   listOrder: ['new-orders', 'board-a', 'board-b'],
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
  let ordersForListData 
  // creating the lists means we're starting the app totally fresh.
  // that is, all orders in db should be allocated to the 'new-orders' list
  // => so get all orders and put them in the 'new-orders' list
  return Order.find({}) 
    .populate(orderPopulation)
    .exec()
    .then(orders => {
      ordersForListData = _.reduce(orders, (acc, order) => {
        acc[order._id] = { id: order._id, content: order.toJSON()}
        return acc
      }, {})

      const newOrdersList = new List({
        _id: uuidv1(),
        nameId: 'new-orders',
        title: 'NEW ORDERS',
        direction: 'vertical',
        orderIds: [...Object.keys(ordersForListData)],
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

      return List.insertMany([ newOrdersList, boardListA, boardListB ])
    })
    .then(lists => {
      const listsData = {}
      listsData.orders = ordersForListData
      listsData.listOrder = ['new-orders', 'board-a', 'board-b']
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
      // }
      console.log('listsData')
      console.log(listsData)
      return listsData
    })
}

const getTheListsInMongo = () => {
  let ordersForListData 
  return Order.find({}) 
    .populate(orderPopulation)
    .exec()
    .then(orders => {
      ordersForListData = _.reduce(orders, (acc, order) => {
        acc[order._id] = {id: order._id, content: order.toJSON()}
        return acc
      }, {})
      return List.find({})
    })
    .then(lists => {
      const listsData = {}
      listsData.orders = ordersForListData
      // default for now to hard-coding listOrder. maybe change later
      // to allow lists to move around
      listsData.listOrder = ['new-orders', 'board-a', 'board-b']
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
      // }
      console.log('listsData')
      console.log(listsData)
      
      return listsData
    })

}

export const startSetupLists = () => {
  return (dispatch, getState) => {
    List.countDocuments().exec()
      .then(count => {
        if (count === 3) {
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

// TODO: incorporate Mongodb for persistence
// this is called when an item in any of the lists gets
// dragged to another position (either in the same or different list)
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

// FROM order.js actions.....

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