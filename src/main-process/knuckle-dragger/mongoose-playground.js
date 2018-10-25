const _ = require('lodash')
const stringify = require('json-stringify-pretty-compact')
import { Order, Course, Item, Info, InfoLine } from './models/models'
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })

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
    console.log(stringify(order))
  })
  .catch(err => {
    throw err
  }) 
}