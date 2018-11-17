import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'

// TODO: different default state data structure?
// ... think so. look below at initialData structure
const listsReducerDefaultState = {
  orders: { },
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
  },
  // faciliatate reordering of the orders ? 
  listOrder: ['new-orders', 'board-a', 'board-b'],
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







    default:
      return state
  }
}