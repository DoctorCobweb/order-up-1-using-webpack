import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'
import moment from 'moment'

// TODO: different default state data structure?
// ... think so. look below at initialData structure
const listsReducerDefaultState = {
  orders: {},
  completedOrders: {},
  lists: {
    'new-orders': {
      nameId: 'new-orders',
      title: 'NEW ORDERS',
      direction: 'vertical',
      orderIds: [],
    },
    'board-a': {
      nameId: 'board-a',
      title: 'BOARD A',
      direction: 'horizontal',
      orderIds: [],
    },
    'board-b': {
      nameId: 'board-b',
      title: 'BOARD B',
      direction: 'horizontal',
      orderIds: [],
    },
    'completed-orders': {
      nameId: 'completed-orders',
      title: 'Completed Orders',
      direction: 'vertical',
      orderIds: [],

    },
  },
  // faciliatate reordering of the orders ? 
  listOrder: ['new-orders', 'board-a', 'board-b', 'completed-orders'],
}


// the 'state' here is the lists slice (you don't have to do this: state.lists)
export default (state=listsReducerDefaultState, action) => {
  switch(action.type) {

    case 'SETUP_LISTS': 
      // console.log('SETUP_LISTS')
      // console.log(action.payload.listsData)
      return action.payload.listsData
      // return state

    case 'UPDATE_ORDER_IDS_IN_LISTS': 
      return action.payload.data

    case 'ADD_ORDER_TO_LISTS':
      const stateCopy = _.cloneDeep(state)
      const newOrder = action.payload.order
      
      stateCopy.orders[newOrder._id] = {
        id: newOrder._id,
        content: newOrder,
      }
      stateCopy.lists['new-orders'].orderIds.push(newOrder._id)

      return stateCopy

    case 'SET_ORDER_AS_COMPLETED':
      // have todo:
      // 1. remove the order from state.lists.orders
      // 2. move order to state.lists.completedOrders
      // 3. remove the orderId from the orderIds array in the list
      //    which contains it

      // clone the whole state
      const stateCloneForCompletedOrder = _.cloneDeep(state)

      // action.payload.orderId
      // action.payload.listNameId

      // find the order in state.orders, then clone it
      const completedOrderClone = _.cloneDeep(stateCloneForCompletedOrder
        .orders[ action.payload.orderId ])

      // update the completed field 
      completedOrderClone.content.completed = true

      // put the clone completed order over to state.completedOrders object
      stateCloneForCompletedOrder.completedOrders[action.payload.orderId ] = {
        id: action.payload.orderId,
        content: completedOrderClone.content, 
      }

      // put the completed orderId into the completed-order list
      stateCloneForCompletedOrder.lists['completed-orders'].orderIds.push(action.payload.orderId)

      // delete the completed order from state.orders
      delete stateCloneForCompletedOrder.orders[ action.payload.orderId ]

      // finally, delete the orderId from whatever list it was sitting in before being
      // marked as complete
      const deleteIdx = stateCloneForCompletedOrder
        .lists[ action.payload.listNameId ].orderIds
        .indexOf(action.payload.orderId)

      stateCloneForCompletedOrder
        .lists[ action.payload.listNameId ].orderIds
        .splice(deleteIdx, 1)

      // console.log('stateCloneForCompletedOrder')
      // console.log(stateCloneForCompletedOrder)

      return stateCloneForCompletedOrder
      


////////////////////////////////////////////////////////////
//
// FROM order.js actions.....
//
////////////////////////////////////////////////////////////


    case 'ADD_NEW_INFO':
      const stateCloneForAddNewInfo = _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneForAddNewInfo = stateCloneForAddNewInfo.orders[action.payload.orderId]

      orderCloneForAddNewInfo.content.courses = 
        orderCloneForAddNewInfo.content.courses.map(course => {
          if (course._id === action.payload.courseId) {
            course.items.map(item => {
              if (item._id === action.payload.itemId) {
                item.infos.push(action.payload.newInfo)
              }
              return item
            })
          }
          return course
        })

      return {
        ...stateCloneForAddNewInfo,
        orders: {
          ...stateCloneForAddNewInfo.orders,
          [action.payload.orderId]: orderCloneForAddNewInfo
        }
      }

    case 'UPDATE_ITEM_QUANTITY':
      const stateCloneForUpdateItemQuantity = _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneForUpdateItemQuantity = 
        stateCloneForUpdateItemQuantity.orders[action.payload.orderId]
      
      orderCloneForUpdateItemQuantity.content.courses = 
        orderCloneForUpdateItemQuantity.content.courses.map(course => {
          if (course._id === action.payload.courseId) {
            course.items.map(item => {
              if (item._id === action.payload.itemId) {
                item.quantity += action.payload.amount
                item.completed = action.payload.completed
              }
              return item
            })
          }
          return course
        })

      return {
        ...stateCloneForUpdateItemQuantity,
        orders: {
          ...stateCloneForUpdateItemQuantity.orders,
          [action.payload.orderId]: orderCloneForUpdateItemQuantity
        }
      }

    case 'UPDATE_ITEM_AND_INFO_QUANTITY':
      const stateCloneForUpdateItemAndInfoQuantity = _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneForUpdateItemAndInfoQuantity = 
        stateCloneForUpdateItemAndInfoQuantity.orders[action.payload.orderId]

      orderCloneForUpdateItemAndInfoQuantity.content.courses =
        orderCloneForUpdateItemAndInfoQuantity.content.courses.map(course => {
          if (course._id === action.payload.courseId) {
            course.items.map(item => {
              if (item._id === action.payload.itemId) {
                item.infos.map(info => {
                  if (info._id === action.payload.infoId) {
                    item.quantity += action.payload.amount
                    item.completed = action.payload.itemCompleted
                    info.quantity += action.payload.amount
                    info.completed = action.payload.infoCompleted
                  }
                  return info
                })
              }
              return item
            })
          }
          return course
        })

      return {
        ...stateCloneForUpdateItemAndInfoQuantity,
        orders: {
          ...stateCloneForUpdateItemAndInfoQuantity.orders,
          [action.payload.orderId]: orderCloneForUpdateItemAndInfoQuantity  
        }
      }

    case 'UPDATE_INFOLINE':
      const stateCloneForUpdateInfoLine= _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneForUpdateInfoLine = 
        stateCloneForUpdateInfoLine.orders[action.payload.orderId]

      orderCloneForUpdateInfoLine.content.courses = 
        orderCloneForUpdateInfoLine.content.courses.map(course => {
          if (course._id === action.payload.courseId) {
            course.items.map(item => {
              if (item._id === action.payload.itemId) {
                item.infos.map(info => {
                  if (info._id === action.payload.infoId) {
                    info.infoLines.map(infoLine => {
                      if (infoLine._id === action.payload.infoLineId) {
                        infoLine.quantity = action.payload.quantity
                        infoLine.name = action.payload.name
                      }
                      return infoLine
                    })
                  }
                  return info
                })
              }
              return item
            })
          }
          return course
      })

      return {
        ...stateCloneForUpdateInfoLine,
        orders: {
          ...stateCloneForUpdateInfoLine.orders,
          [action.payload.orderId]: orderCloneForUpdateInfoLine
        }
      }

    case 'ADD_NEW_INFOLINE':
      const stateCloneForAddNewInfoLine= _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneForAddNewInfoLine = 
        stateCloneForAddNewInfoLine.orders[action.payload.orderId]

      orderCloneForAddNewInfoLine.content.courses = 
        orderCloneForAddNewInfoLine.content.courses.map(course => {
          if (course._id === action.payload.courseId) {
            course.items.map(item => {
              if (item._id === action.payload.itemId) {
                item.infos.map(info => {
                  if (info._id === action.payload.infoId) {
                    info.infoLines.push({
                      _id: action.payload.newInfoLineId,
                      quantity: action.payload.newInfoLineQuantity,
                      name: action.payload.newInfoLineName,
                    })
                  }
                  return info
                })
              }
              return item
            })
          }
          return course
      })

      return {
        ...stateCloneForAddNewInfoLine,
        orders: {
          ...stateCloneForAddNewInfoLine.orders,
          [action.payload.orderId]: orderCloneForAddNewInfoLine
        }
      }

    case 'DELETE_ALL_ORDERS':
      return listsReducerDefaultState 

    case 'TOGGLE_GO_ON_MAINS':
      const stateCloneToggleGoOnMains = _.cloneDeep(state)

      // in state.orders, an order data strucure is like:
      // <order _id>: { id: <order _id>, content: <order>}
      const orderCloneToggleGoOnMains = 
        stateCloneToggleGoOnMains.orders[action.payload.orderId]

      orderCloneToggleGoOnMains.content.goOnMains = action.payload.goOnMains
      orderCloneToggleGoOnMains.content.goOnMainsStartedAt = action.payload.goOnMainsStartedAt

      return {
        ...stateCloneToggleGoOnMains,
        orders: {
          ...stateCloneToggleGoOnMains.orders,
          [action.payload.orderId]: orderCloneToggleGoOnMains
        }
      }

    default:
      return state
  }
}