import mongoose from 'mongoose'
const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: String
})


export default mongoose.model('Course', courseSchema)