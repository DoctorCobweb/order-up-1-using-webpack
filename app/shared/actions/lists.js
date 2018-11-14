import { Order, Course, Item, Info, InfoLine } from '../models/order'
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
//       id: 'new-orders',
//       title: 'NEW ORDERS',
//       direction: 'vertical',
//       orderIds: ['_id-1', '_id-2', '_id-3', '_id-4'],
//     },
//     'board-a': {
//       id: 'board-a',
//       title: 'BOARD A',
//       direction: 'horizontal',
//       orderIds: [],
//     },
//     'board-b': {
//       id: 'board-b',
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

// ------------------------------
// export const setOrders = (orders) => ({
//   type: 'SET_ORDERS',
//   payload: {
//     orders
//   }
// })

// export const startSetOrders = () => {
//   return (dispatch, getState) => {
//     console.log('hello from startSetOrders@')

//     return Order.find({ list: 'new-orders'}) 
//       .populate(orderPopulation)
//       .exec()
//       .then(orders => {
//         const ordersCleanedUp = _.map(orders, order => order.toJSON())
//         console.log(`found all orders in mongodb. orders.length=${ordersCleanedUp.length}`)
//         dispatch(setOrders(ordersCleanedUp))
//       })
//       .catch(err => {
//         throw err
//       })
//   }
// }
// ------------------------------

export const setupLists = (listsData) => ({
  type: 'SETUP_LISTS',
  payload: {
    listsData
  }
})

// TODO: incorporate Mongodb for persistence
export const startSetupLists = () => {
  return (dispatch, getState) => {
    return Order.find({}) 
    // return Order.find({ list: 'new-orders'}) 
      .populate(orderPopulation)
      .exec()
      .then(orders => {
        const ordersCleanedUp = _.map(orders, order => order.toJSON())
        console.log(`found all  new-orders orders in mongodb. orders.length=${ordersCleanedUp.length}`)
        const listsData = {}
        const ordersForListData = _.reduce(ordersCleanedUp, (acc, val) => {
          acc[val._id] = { id: val._id, content: val}
          return acc
        }, {})
        listsData.orders = ordersForListData
        listsData.lists = {
          'new-orders': {
            id: 'new-orders',
            title: 'NEW ORDERS',
            direction: 'vertical',
            orderIds: [...Object.keys(ordersForListData)],
          },
          'board-a': {
            id: 'board-a',
            title: 'BOARD A',
            direction: 'horizontal',
            orderIds: [],
          },
          'board-b': {
            id: 'board-b',
            title: 'BOARD B',
            direction: 'horizontal',
            orderIds: [],
          },
        }
        listsData.listOrder = ['new-orders', 'board-a', 'board-b']
        console.log(listsData)

        dispatch(setupLists(listsData))
      })
      .catch(err => {
        throw err
      })
    // find all Orders with list='new-orders'
    // find all Lists
    // construct the payload using structure as seen above in `listsReducerDefaulState` 
    dispatch(setupLists())
  }
}

export const updateLists = (data) => ({
  type: 'UPDATE_LISTS',
  payload: data
})

// TODO: incorporate Mongodb for persistence
export const startUpdateLists = (data) => {
  return (dispatch, getState) => {
    // 
    dispatch(updateLists(data))
  }
}

