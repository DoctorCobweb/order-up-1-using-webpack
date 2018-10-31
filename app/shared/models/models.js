import mongoose from 'mongoose'
const Schema = mongoose.Schema

const orderSchema = new Schema({
  _id: String,
  completed: { type: Boolean, default: false },
  assignedToBoard: { type: Boolean, default: false },
  clerk: String,
  covers: Number,
  customerName: String,
  location: String,
  orderSentAt: String,
  orderTakenUsing: String,
  tableNumber: String,
  variableContent: [String],
  courses: [{type: String, ref: 'Course'}]
})

const courseSchema = new Schema({
  _id: String,
  completed: { type: Boolean, default: false},
  name: String,
  items: [{type: String, ref: 'Item'}]
})

const itemSchema = new Schema({
  _id: String,
  completed: { type: Boolean, default: false},
  name: String,
  quantity: Number,
  infos: [{type: String, ref: 'Info'}]
})

const infoSchema = new Schema({
  _id: String,
  completed: { type: Boolean, default: false},
  infoLines: [{type: String, ref:'InfoLine'}]
})

const infoLineSchema = new Schema({
  _id: String,
  name: String,
  quantity: Number 
})

const Order = mongoose.model('Order', orderSchema)
const Course = mongoose.model('Course', courseSchema)
const Item = mongoose.model('Item', itemSchema)
const Info = mongoose.model('Info', infoSchema)
const InfoLine = mongoose.model('InfoLine', infoLineSchema)

export { Order, Course, Item, Info, InfoLine }
