import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'
import { Order, Course, Item, Info, InfoLine } from '../../shared/models/models'
import { populateAllOrders, streamDemo } from './mongoose-playground'
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid


export const addToMongoDB = (db, order) => {
  // streamDemo()

  // order is a deeply nested object. at each 'level' of the order
  // we define a model, and link them up via subdocuments in the 
  // model's schema.
  // in other words, we use the concept of subdocuments in Mongoose
  // to allow for defining the following relationships in our order:
  // 1. an 'Order' model points to many 'Course' models
  // 2. each 'Course' model points to many 'Item' models
  // 3. each 'Item' model can point to many 'Info' models
  // 4. finally, each 'Info' points to many 'InfoLine' models
  //
  // linking these all up creates our order in a normalized form.
  // then, to recreate the order we query for an 'Order' document and 
  // call populate() yadda yadda yadda.

  // we use a Map here because we will be iterating over our order
  // many times whilst saving our documents to the db. since objects
  // and iteration of its keys have non-dependent ordering we choose to 
  // use a Map version of the order.
  // the map will we updated with _ids as we go through saving models to the db.
  // when all our models have been saved to the db, the map will hold not only
  // the order content, but all the _ids of each inserted doc.
  const orderMap = createOrderMap(order)

  // start adding InfoLines to the db, then Info, then Item, ....
  // ie. from the leaves of the tree (InfoLines) to the trunk (Order).
  // doing this allows us to get the _ids needed for each Model's subdocument 
  // array of _ids. see above, the schema definitions to see how each model
  // links up with its 'children'

  // insert infoline 
  const infoLines = _.map(orderMap.get('itemInfos'), (info) => {
    return _.map(info, (itemInfo) => {
      return _.map(itemInfo, infoLine => {
        const [ name, quantity ] = infoLine
        return new InfoLine({
          _id: uuidv1(),
          name,
          quantity
        })
      })
    })
  })

  InfoLine.insertMany(_.flattenDepth(infoLines,2) , {ordered: true})
    .then(infoLinesResults => {
      // console.log(infoLinesResults)
      const updatedMap = updateOrderMapWithItemInfoIds(orderMap, infoLinesResults)
      // console.log('updatedMap.get(\'itemInfos\')')
      // console.log(stringify(updatedMap.get('itemInfos')))

      // now go onto inserting the 'Info' models
      insertInfos(updatedMap)
    })
    .catch(err => {
      throw err
    })
}

const insertInfos = (orderMap) => {
  const infos = _.map(orderMap.get('itemInfos'), (info) => {
    return _.map(info, itemInfo => {
      const infoLinesIds = _.map(itemInfo, infoLine => {
          const [ id ] = infoLine 
          return id
      })
      return new Info({
        _id: uuidv1(),
        infoLines: infoLinesIds
      })
    })
  })
  // console.log('stringify(infos)')
  // console.log(stringify(infos))

  Info.insertMany(_.flattenDepth(infos, 1), {ordered: true})
    .then(results => {
      // console.log(results)
      const updatedMap = updateOrderMapWithItemIds(orderMap, results)
      // console.log('updatedMap Info.insertMany then()')
      // console.log(stringify(updatedMap.get('items')))

      // now go onto inserting the 'Item' models
      insertItems(updatedMap)
    })
    .catch(err => {
      throw err
    })
}

const insertItems = (orderMap) => {
  const items = _.flattenDepth(orderMap.get('items'), 1)
  const itemsDocs = _.map(items, item => {
    const [ name, quantity, infos ] = item
    return new Item({
      _id: uuidv1(),
      name,
      quantity,
      infos
    })
  })

  Item.insertMany(itemsDocs, {ordered: true})
    .then(results => {
      // console.log('results:')
      // console.log(results)
      const updatedMap = updateOrderMapWithCourseIds(orderMap, results)
      // console.log('updatedMap.get(\'updatedCourses\')')
      // console.log(stringify(updatedMap.get('updatedCourses')))

      //insert the courses
      insertCourses(updatedMap)
    })
    .catch(err => {
      throw err
    })
}

const insertCourses = (orderMap) => {
  const courses = orderMap.get('updatedCourses')
  const courseDocs = _.map(courses, course => {
    const [ courseName, items ] = course 
    return new Course({
      _id: uuidv1(),
      name: courseName,
      items
    })
  })

  Course.insertMany(courseDocs, {order: true})
    .then(results => {
      // console.log('Course.insertMany results')
      // console.log(results)

      //finally create the order doc
      createOrderAndSave(orderMap, results)
      // const updatedMap = updateOrderMapWithOrderIds(orderMap, results)
    })
    .catch(err => {
      throw err
    })
}

const createOrderAndSave = (map, vals) => {
  const courseIds = _.map(vals, course => course._id)
  const courseMetaData = map.get('order').metaData
  const orderDoc = new Order({
    _id: uuidv1(),
    clerk: courseMetaData.clerk,
    covers: courseMetaData.covers,
    customerName: courseMetaData.customerName,
    location: courseMetaData.location,
    orderSentAt: courseMetaData.orderSentAt,
    orderTakenUsing: courseMetaData.orderTakenUsing,
    tableNumber: courseMetaData.tableNumber,
    variableContent: courseMetaData.variableContent,
    courses: courseIds
  })

  Order.create(orderDoc)
    .then(results => {
      // FINISH PROCESS OF ADDING THE ORDER TO MONGODB
      // console.log('FINALLY! WE SHOULD HAVE OUR ORDER')
      // console.log(results)
      // try populate the order
      // populateAllOrders()
    })
    .catch(err => {
      throw err
    })
}

const updateOrderMapWithCourseIds = (map, vals) => {
  const ids = _.map(vals, item => item._id)
  let i = 0
  const order = map.get('order')
  const courses = map.get('courses')
  const updatedCourses = _.map(courses, course => {
    const courseItems = order.meals[course]
    // console.log('courseItems')
    // console.log(courseItems)
    const courseItemIds = _.map(courseItems, item => {
      const anItemId = ids[i]
      i++
      return anItemId
    })
    return [ course, courseItemIds ]
  })
  // make an new key/val entry in map. the 'courses' key
  // is used so pivotly to determine correct orderering 
  // that it's prudent to make a new entry.
  map.set('updatedCourses', updatedCourses)
  return map 
}

const updateOrderMapWithItemIds = (map, vals) => {
  const ids = _.map(vals, info => info._id)
  let i = 0
  const items = map.get('items')
  const updatedItems = _.map(items, course => {
    return _.map(course, item => {
      const [ name, quantity, info] = item
      if (_.isEmpty(info)) return [ name, quantity, [] ] 
      const yadda = _.map(info, anInfo => {
        const anId = ids[i]
        i++
        return anId
      })
      return [ name, quantity, yadda ]
    })
  })
  map.set('items', updatedItems)
  return map
}

const updateOrderMapWithItemInfoIds = (map, vals) => {
  const ids = _.map(vals, line => line._id )
  let i = 0
  const itemInfos = map.get('itemInfos')
  const updatedItemInfos = _.map(itemInfos, item => {
    if (_.isEmpty(item)) return item
    return _.map(item, itemInfo => {
      return _.map(itemInfo, line => {
        const [ name, quantity ] = line
        const newItemInfo = [ ids[i], name, quantity ]
        i++
        return newItemInfo
      })
    })
  })
  map.set('itemInfos', updatedItemInfos)
  return map
}

const createOrderMap = (order) => {
  const map = new Map()
  const sortedCourseNames = _.sortBy(_.keys(order.meals))
  const courseItems = _.map(sortedCourseNames, (course) => {
    const items = order.meals[course]
    return _.map(items, (item) => {
      return [item.name, item.quantity, item.info]
    })
  })

  const itemInfos = _.flatten(_.map(sortedCourseNames, (course) => {
    const items = order.meals[course]
    return _.map(items, (item) => {
      return _.map(item.info, info => {
        return _.map(info, (infoItem) => {
          return [infoItem.info, infoItem.quantity]
        })
      })
    })
  }))

  // console.log(JSON.stringify(itemInfos))
  map.set('order', order)
  map.set('courses',sortedCourseNames)
  map.set('items', courseItems)
  map.set('itemInfos', itemInfos)
  // console.log('map.get(\'items\')')
  // console.log(stringify(map.get('items')))
  // console.log('map.get(\'itemInfos\'):')
  // console.log(stringify(map.get('itemInfos')))

  // 1. add itemInfos to db. put their _ids into corresponding spot in map. after success, call next insert:
  // 2. add iems to db. ditto. ditto, then call next insert:
  // 3. add courses to db. ditto. ditto. then call next insert:
  // 4. add order to db
  return map
}