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

// TODO: incorporate Mongodb for persistence
export const startSetupLists = () => {
  let ordersForListData 
  return (dispatch, getState) => {
    return Order.find({ list: 'new-orders'}) 
      .populate(orderPopulation)
      .exec()
      .then(orders => {

        const ordersCleanedUp = _.map(orders, order => order.toJSON())
        console.log(`found new-orders orders in mongodb. orders.length=${ordersCleanedUp.length}`)
        ordersForListData = _.reduce(ordersCleanedUp, (acc, val) => {
          acc[val._id] = { id: val._id, content: val}
          return acc
        }, {})

        // TODO: dont recreate the lists if they already exist

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
        const listsJSON = lists.map(list => list.toJSON())
        const listsData = {}
        listsData.orders = ordersForListData
        listsData.listOrder = ['new-orders', 'board-a', 'board-b']
        listsData.lists = _.reduce(listsJSON, (acc, list) => {
          acc[list.nameId] = list
          return acc
        }, {})

        // IT SHOULD LOOK LIKE THIS:
        // listsData.lists = {
        //   'new-orders': {
        //     _id: 'abc1',       
        //     nameId: 'new-orders',
        //     title: 'NEW ORDERS',
        //     direction: 'vertical',
        //     orderIds: [...Object.keys(ordersForListData)],
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

        dispatch(setupLists(listsData))
      })
      .catch(err => {
        throw err
      })
  }
}

export const updateLists = (data) => ({
  type: 'UPDATE_LISTS',
  payload: {
    data,
  }
})

// TODO: incorporate Mongodb for persistence
// this is called when an item in any of the lists gets
// dragged to another position (either in the same or different list)
export const startUpdateLists = (data) => {
  return (dispatch, getState) => {
    dispatch(updateLists(data))
  }
}

export const addOrderToLists = (order) => ({
  type: 'ADD_ORDER_TO_LISTS',
  payload: {
    order,
  }
})

export const startAddOrderToLists = (orderId) => {
  return (dispatch, getState) => {
    return Order.findById(orderId)
      .populate(orderPopulation)
      .exec()
      .then(order => {
        console.log('startAddOrderToLists(). order is')
        console.log(order)
        dispatch(addOrderToLists(order.toJSON()))
      })
      .catch(err => {
        throw err
      })
  }
}