import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema({
  clerk: String,
  covers: String,
  customerName: String,
  location: String,
  orderSentAt: String,
  orderTakenUsing: String,
  tableNumber: String,
  variableContent: [String],
  courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
})

const courseSchema = new Schema({
  name: String,
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
})

const itemSchema = new Schema({
  name: String,
  quantity: String,
  infos: [{type: Schema.Types.ObjectId, ref: 'Info'}]
})

const infoSchema = new Schema({
  infoLines: [{type: Schema.Types.ObjectId, ref:'InfoLine'}]
})

const infoLineSchema = new Schema({
  name: String,
  quantity: String
})

const Order = mongoose.model('Order', orderSchema)
const Course = mongoose.model('Course', courseSchema)
const Item = mongoose.model('Item', itemSchema)
const Info = mongoose.model('Info', infoSchema)
const InfoLine = mongoose.model('InfoLine', infoLineSchema)


export const mongooseOrders = (db, order) => {

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
        return new InfoLine({ name, quantity })
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
        infoLines: infoLinesIds
      })
    })
  })
  // console.log('stringify(infos)')
  // console.log(stringify(infos))

  Info.insertMany(_.flattenDepth(infos, 1), {ordered: true})
    .then(results => {
      console.log(results)
      const updatedMap = updateOrderMapWithItemIds(orderMap, results)
      console.log('updatedMap Info.insertMany then()')
      console.log(stringify(updatedMap.get('items')))

      // now go onto inserting the 'Item' models
      // TODO
    })
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
  map.set('courses',sortedCourseNames)
  map.set('items', courseItems)
  map.set('itemInfos', itemInfos)
  console.log('map.get(\'items\')')
  console.log(stringify(map.get('items')))
  // console.log('map.get(\'itemInfos\'):')
  // console.log(stringify(map.get('itemInfos')))

  // 1. add itemInfos to db. put their _ids into corresponding spot in map. after success, call next insert:
  // 2. add iems to db. ditto. ditto, then call next insert:
  // 3. add courses to db. ditto. ditto. then call next insert:
  // 4. add order to db
  return map
}