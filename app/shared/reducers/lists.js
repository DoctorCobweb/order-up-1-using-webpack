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




    case 'ADD_NEW_INFO':
      const listsStateClone = _.cloneDeep(state)
      listsStateClone.orders = listsStateClone.orders.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const newInfo = action.payload.newInfo
        const quantity = action.payload.quantity

        // an order looks like this in state.orders:
        // order === <mongo _id> : { id: <the mongo _id>, content: <the populated Mongo Order> }

        if (order.id === orderId) {
          const orderClone = _.cloneDeep(order)
          const orderContentClone = _.cloneDeep(orderClone.content)
          orderContentClone.courses = orderContentClone.courses.map(course => {
            if (course._id === courseId) {
              const courseCopy = _.cloneDeep(course)
              courseCopy.items = courseCopy.items.map(item => {
                if (item._id === itemId) {
                  const itemCopy = _.cloneDeep(item)
                  const infosCopy = _.cloneDeep(itemCopy.infos)
                  infosCopy.push(newInfo)
                  itemCopy.infos = infosCopy
                  return itemCopy
                } else {
                  return item
                }
              })
              return courseCopy
            } else {
              return course
            }
          })
          orderClone.content = orderContentClone
          return orderClone
        } else {
          return order
        }
      }) 
      // console.log('listsStateClone')
      // console.log('listsStateClone)
      return listsStateClone 






    default:
      return state
  }
}