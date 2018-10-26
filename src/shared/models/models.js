import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema({
  done: { type: Boolean, default: false},
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
  done: { type: Boolean, default: false},
  name: String,
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}]
})

const itemSchema = new Schema({
  done: { type: Boolean, default: false},
  name: String,
  quantity: String,
  infos: [{type: Schema.Types.ObjectId, ref: 'Info'}]
})

const infoSchema = new Schema({
  done: { type: Boolean, default: false},
  infoLines: [{type: Schema.Types.ObjectId, ref:'InfoLine'}]
})

const infoLineSchema = new Schema({
  done: { type: Boolean, default: false},
  name: String,
  quantity: String
})

const Order = mongoose.model('Order', orderSchema)
const Course = mongoose.model('Course', courseSchema)
const Item = mongoose.model('Item', itemSchema)
const Info = mongoose.model('Info', infoSchema)
const InfoLine = mongoose.model('InfoLine', infoLineSchema)

export { Order, Course, Item, Info, InfoLine }