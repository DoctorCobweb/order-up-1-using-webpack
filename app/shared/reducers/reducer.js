import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'
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
      const updatedItemState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const amount = action.payload.amount
        // ALGO:
        // 1. find the order then clone it
        // 2 drill down to items by matching orderId, then courseId
        // 3. match item using itemId, then update the item in question
        // 4. then return course (cloned version)
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
      // console.log('updatedItemState')
      // console.log(updatedItemState)
      return updatedItemState
    case 'UPDATE_ITEM_AND_INFO_QUANTITY':
      const updatedItemAndInfoState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const infoId = action.payload.infoId
        const amount = action.payload.amount

        // update the quantity in two places
        // 1. item
        // 2. itemInfo
        //
        // 
        // ALGO (COPIED FROM ABOVE):
        // 1. find the order then clone it
        // 2. drill down to items by matching orderId, then courseId
        // 3. match item using itemId
        // 4. update the matched item and cycle thru its infos
        // 5. match infoItem using infoId, then update it
        // 6. then return course (cloned version)
        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.courses = orderClone.courses.map(course => {
            if (course._id === courseId) {
              const courseCopy = _.cloneDeep(course)
              courseCopy.items = courseCopy.items.map(item => {
                if (item._id === itemId) {
                  const itemCopy = _.cloneDeep(item)
                  itemCopy.infos = itemCopy.infos.map(info => {
                    if(info._id === infoId) {
                      // amount is either 1 or (-1)
                      itemCopy.quantity += amount
                      const infoCopy = _.cloneDeep(info)
                      infoCopy.quantity += amount
                      return infoCopy
                    } else {
                      return info
                    }
                  })
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
          return orderClone
        } else {
          return order
        }
      }) 
      // console.log('updatedItemAndInfoState ')
      // console.log(updatedItemAndInfoState)
      return updatedItemAndInfoState 
    default:
      return state
  }
}
