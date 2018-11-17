// **** JETTISON AWAY ****
import _ from 'lodash'

const coursesOrdered = [
  "ENTREES DINNER",
  "MAINS DINNER",
  "BAR MEALS",
  "DESSERT",
  "CHILDS MENUS",
  "CHILD DESSERT TOPS",
  "ADD MODIFIERS",
  "SPECIAL INSTRUCTIONS",
  "COFFEE TYPES",
  "SIDES"
]

export const findOrder = (ordersState, orderId) => {
  return ordersState.filter(order => order._id === orderId)[0]
}

export const sortCoursesInOrder = (order) => {
  // do we need to clone courses? considering what
  // immutability of data means; here we're changing
  // the ordering of the courses array.
  // const coursesClone = _.cloneDeep(order.courses)
  order.courses = _.sortBy(order.courses, course => {
    return coursesOrdered.indexOf(course.name)
  })
  return order
}
