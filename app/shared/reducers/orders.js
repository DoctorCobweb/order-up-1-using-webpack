import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'

const ordersReducerDefaultState = []

// the 'state' here is the orders slice (you don't have to do this: state.orders)
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
        const completed = action.payload.completed
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
                  item.completed = completed
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
        const itemCompleted = action.payload.itemCompleted
        const infoCompleted = action.payload.infoCompleted

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
                      const infoCopy = _.cloneDeep(info)
                      // amount is either 1 or (-1)
                      itemCopy.quantity += amount
                      itemCopy.completed = itemCompleted
                      infoCopy.quantity += amount
                      infoCopy.completed = infoCompleted
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

    case 'UPDATE_INFOLINE':
      const updatedInfoLineState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const infoId = action.payload.infoId
        const infoLineId = action.payload.infoLineId
        const quantity = action.payload.quantity
        const name = action.payload.name

        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.courses = orderClone.courses.map(course => {
            if (course._id === courseId) {
              const courseCopy = _.cloneDeep(course)
              courseCopy.items = courseCopy.items.map(item => {
                if (item._id === itemId) {
                  const itemCopy = _.cloneDeep(item)
                  itemCopy.infos = itemCopy.infos.map(info => {
                    if (info._id === infoId) {
                      const infoCopy = _.cloneDeep(info)
                      infoCopy.infoLines = infoCopy.infoLines.map(infoLine => {
                        if (infoLine._id === infoLineId ) {
                          const infoLineCopy = _.cloneDeep(infoLine)
                          infoLineCopy.quantity = quantity
                          infoLineCopy.name = name
                          return infoLineCopy
                        } else {
                          return infoLine
                        }
                      })
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
      // console.log('updatedInfoLineState ')
      // console.log(updatedInfoLineState)
      return updatedInfoLineState

    case 'ADD_NEW_INFOLINE':
      const newInfoLineState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const infoId = action.payload.infoId
        const newInfoLineId = action.payload.newInfoLineId
        const newInfoLineQuantity = action.payload.newInfoLineQuantity
        const newInfoLineName = action.payload.newInfoLineName

        const newInfoLineObj = {
          _id: newInfoLineId,
          quantity: newInfoLineQuantity,
          name: newInfoLineName
        }
        // console.log(`infoId(reducer): ${infoId}`)

        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.courses = orderClone.courses.map(course => {
            if (course._id === courseId) {
              const courseCopy = _.cloneDeep(course)
              courseCopy.items = courseCopy.items.map(item => {
                if (item._id === itemId) {
                  const itemCopy = _.cloneDeep(item)
                  itemCopy.infos = itemCopy.infos.map(info => {
                    if (info._id === infoId) {
                      const infoCopy = _.cloneDeep(info)
                      const infoLinesCopy = _.cloneDeep(infoCopy.infoLines)
                      const newInfoLineObjCopy = _.cloneDeep(newInfoLineObj)
                      infoLinesCopy.push(newInfoLineObjCopy)
                      infoCopy.infoLines = infoLinesCopy
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
      // console.log('newInfoLineState ')
      // console.log(newInfoLineState)
      return newInfoLineState

    case 'ADD_NEW_INFO':
      const newInfoState = state.map(order => {
        const orderId = action.payload.orderId
        const courseId = action.payload.courseId
        const itemId = action.payload.itemId
        const newInfo = action.payload.newInfo
        const quantity = action.payload.quantity

        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.courses = orderClone.courses.map(course => {
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
          return orderClone
        } else {
          return order
        }
      }) 
      // console.log('newInfoState ')
      // console.log(newInfoState)
      return newInfoState

    case 'TOGGLE_GO_ON_MAINS':
      const toggleGoOnMainsState = state.map(order => {
        const orderId = action.payload.orderId
        const goOnMainsBool = action.payload.goOnMainsBool
        const timestamp = action.payload.timestamp

        if (order._id === orderId) {
          const orderClone = _.cloneDeep(order)
          orderClone.goOnMains = goOnMainsBool
          orderClone.goOnMainsStartedAt = timestamp
          return orderClone
        } else {
          return order
        }
      }) 
      // console.log('toggleGoOnMainsState ')
      // console.log(toggleGoOnMainsState)
      return toggleGoOnMainsState 

    case 'SET_ORDERS':
      return action.payload.orders

    case 'DELETE_ALL_ORDERS':
      return ordersReducerDefaultState

    default:
      return state // or just 'state' ?
  }
}
