import mongoose from 'mongoose'
const Schema = mongoose.Schema

const listSchema = new Schema ({
  _id: String,
  nameId: String,
  title: String,
  direction: String,
  orderIds: [String],
})

const List = mongoose.model('List', listSchema)

export { List }