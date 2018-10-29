import _ from 'lodash'
import stringify from 'json-stringify-pretty-compact'
import { Order, Course, Item, Info, InfoLine } from '../../shared/models/models'
import mongoose from 'mongoose'
import { normalize, schema } from 'normalizr'
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

// define schema for normalizr
const infoLine = new schema.Entity('infolines')

const info = new schema.Entity('infos', {
  infoLines: [infoLine]
})

const item = new schema.Entity('items', {
  infos: [info]
})

const course = new schema.Entity('courses', {
  items: [item]
})

const orderNormalizrSchema = new schema.Entity('orders', {
  courses: [course]
})

export const populateAllOrders = () => {
  Order.find({})
  .populate({
    path: 'courses',
    model: 'Course',
    populate: {
      path: 'items',
      model: 'Item',
      populate: {
        path: 'infos',
        model: 'Info',
        populate: {
          path: 'infoLines',
          model: 'InfoLine'
        }
      }
    }
  })
  .exec() 
  .then(order => {
    // console.log('stringify(order)')
    // console.log(stringify(order))
    tryNormalizr(order)
  })
  .catch(err => {
    throw err
  }) 
}

const tryNormalizr = (order) => {
  const normalizedData = normalize(order, orderNormalizrSchema)
  // console.log('normalizedData')
  // console.log(stringify(normalizedData))
}

export const streamDemo = () => {
  // const changeStream = Order.watch().on('change', change => console.log(change))
  // Will print from the above `console.log()`:
  // { _id: { _data: ... },
  //   operationType: 'delete',
  //   ns: { db: 'mydb', coll: 'Person' },
  //   documentKey: { _id: 5a51b125c5500f5aa094c7bd } }


  Order.insertMany([{ name: 'Ned Stark' },{blah:"hkjhlkjhlkjh"}])
    .then(order => {
      // order.remove()
    })
    .catch(err => {
      throw err
    })

}