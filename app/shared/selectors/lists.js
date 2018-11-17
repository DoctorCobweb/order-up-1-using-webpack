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

export const findOrder = (orders, orderId) => {
  return orders[orderId].content
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
