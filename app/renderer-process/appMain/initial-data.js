const initialData = {
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

export default initialData
