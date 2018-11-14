import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'

// TODO: different default state data structure?
// ... think so. look below at initialData structure
const listsReducerDefaultState = {
  orders: {
    '_id-1': { id: '_id-1', content: 'order1'},
    '_id-2': { id: '_id-2', content: 'order2'},
    '_id-3': { id: '_id-3', content: 'order3'},
    '_id-4': { id: '_id-4', content: 'order4'},
  },
  lists: {
    'new-orders': {
      id: 'new-orders',
      title: 'NEW ORDERS',
      direction: 'vertical',
      orderIds: ['_id-1', '_id-2', '_id-3', '_id-4'],
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
      return action.payload
    default:
      return state
  }
}