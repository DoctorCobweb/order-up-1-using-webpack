import mongoose from 'mongoose'
const Schema = mongoose.Schema


const infoLineSchema = new Schema({
  _id: String,
  done: { type: Boolean, default: false},
  name: String,
  quantity: String
})

const infoSchema = new Schema({
  _id: String,
  done: { type: Boolean, default: false},
  infoLines: [{type: String, ref:'InfoLine'}]
  // infoLines: [{type: Schema.Types.ObjectId, ref:'InfoLine'}]
})

const itemSchema = new Schema({
  _id: String,
  done: { type: Boolean, default: false},
  name: String,
  quantity: String,
  infos: [{type: String, ref: 'Info'}]
  // infos: [{type: Schema.Types.ObjectId, ref: 'Info'}]
})

const courseSchema = new Schema({
  _id: String,
  done: { type: Boolean, default: false},
  name: String,
  items: [{type: String, ref: 'Item'}]
  // items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
})

const orderSchema = new Schema({
  _id: String,
  done: { type: Boolean, default: false},
  clerk: String,
  covers: String,
  customerName: String,
  location: String,
  orderSentAt: String,
  orderTakenUsing: String,
  tableNumber: String,
  variableContent: [String],
  courses: [{type: String, ref: 'Course'}]
  // courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
})

const Order = mongoose.model('Order', orderSchema)
const Course = mongoose.model('Course', courseSchema)
const Item = mongoose.model('Item', itemSchema)
const Info = mongoose.model('Info', infoSchema)
const InfoLine = mongoose.model('InfoLine', infoLineSchema)

export { Order, Course, Item, Info, InfoLine }
