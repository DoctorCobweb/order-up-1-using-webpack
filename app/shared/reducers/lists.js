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
      console.log('SETUP_LISTS')
      console.log(action.payload.listsData)
      return action.payload.listsData
      // return state

    case 'UPDATE_LISTS': 
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
    default:
      return state
  }
}