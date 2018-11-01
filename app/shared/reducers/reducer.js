import _ from 'lodash'
// orders reducer

const ordersReducerDefaultState = []

export default (state=ordersReducerDefaultState, action) => {
  switch(action.type) {
    case 'ADD_ORDER': 
      return [
        ...state,
        action.payload
      ]
    case 'UPDATE_ITEM_QUANTITY':
      const updatedState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const amount = action.payload.amount
        // ALGO:
        // 1. find the order
        // 2. make a copy of it
        // 3. cycle thru to items
        // 4. update the item in question
        // 5. then return course (cloned version)
        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.courses = orderClone.courses.map(course => {
            if (course._id === courseId) {
              const courseCopy = _.cloneDeep(course)
              courseCopy.items = courseCopy.items.map(item => {
                if (item._id === itemId) {
                  // amount is either 1 or (-1)
                  item.quantity += amount
                  return item
                } else {
                  return item
                }
              })
              return courseCopy
            } else {
              return course
            }
          })
          return orderClone
        } else {
          return order
        }
      })
      console.log('updatedState')
      console.log(updatedState)
      return updatedState
    default:
      return state
  }
}