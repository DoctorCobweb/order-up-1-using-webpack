import _ from 'lodash'
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

  const orderMap = createOrderMap(order)

  // const courseNames = _.keys(pOrder.meals)

  // courseNames.map(course => {
  //   const itemsInCourse = _.values(pOrder.meals[course])
  //   const itemDocs = itemsInCourse.map(item => {
  //     return new Item ({
  //       name: item.name,
  //       quantity: item.quantity
  //     })
  //   })

  //   db.collections.items.insertMany(itemDocs, {ordered: true})
  //     .then(itemResults => {
  //       const itemIds = _.values(itemResults)
  //       const course = new Course ({
  //         name: course,
  //         items: itemIds
  //       })
  //       return db.collections.courses.save()
  //     })
  //     .then(_course => {
  //       console.log('_course')
  //       console.log(course)

  //     })
  //     .catch(err => {
  //       if (err) throw err
  //     })
  // })



  // const courses = courseNames.map(course => {
  //   return new Course ({
  //     name: course
  //   })
  // }) 
  //
  // db.collections.courses.insertMany(courses, {ordered: true})
  //   .then(docs => {
  //     console.log('inserted Many docs:')
  //     console.log(docs)
  //     const coursesIds = _.values(docs.insertedIds)

  //     const order = new Order({
  //       clerk: pOrder.metaData.clerk,
  //       cover: pOrder.metaData.covers,
  //       customerName: pOrder.metaData.customerName,
  //       location: pOrder.metaData.location,
  //       orderSentAt: pOrder.metaData.orderSentAt,
  //       orderTakenUsing: pOrder.metaData.orderTakenUsing,
  //       tableNumber: pOrder.metaData.tableNumber,
  //       variableContent: pOrder.metaData.variableContent,
  //       courses: coursesIds
  //     })

  //     return order.save()
  //   })
  //   .then(order => {
  //     // find all order documents in db
  //     // Order.find() is a Query, calling .exec() makes it a Promise
  //     return Order.find().populate('courses').exec()
  //   })
  //   .then(orders => {
  //     console.log('orders')
  //     console.log(JSON.stringify(orders, null, 2))
  //   })
  //   .catch(err => {
  //     if (err) throw err
  //   })
}

const createOrderMap = (order) => {
  const map = new Map()
  const sortedCourseNames = _.sortBy(_.keys(order.meals))
  const courseItems = _.map(sortedCourseNames, (course) => {
    const items = order.meals[course]
    return _.map(items, (item) => {
      return [item.name, item.quantity]
    })
  })

  const itemInfos = _.map(sortedCourseNames, (course) => {
    const items = order.meals[course]
    return _.map(items, (item) => {
      return _.map(item.info, info => {
        return _.map(info, (infoItem) => {
          // console.log(infoItem)
          return [infoItem.info, infoItem.quantity]
        })
      })
    })
  })

  // console.log(JSON.stringify(itemInfos))
  map.set('courses',sortedCourseNames)
  map.set('items', courseItems)
  map.set('itemInfos', itemInfos)
  console.log('map')
  console.log(map)
  console.log('map.get(itemInfos)')
  console.log(JSON.stringify(map.get('itemInfos'), null, 2))
}