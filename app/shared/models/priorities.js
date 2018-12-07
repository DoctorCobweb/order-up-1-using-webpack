import mongoose from 'mongoose'
const Schema = mongoose.Schema

const prioritiesSchema = new Schema({
  _id: String,
  priorities: {
    type: Map,
    of: String,
  }
})

const Priorities = mongoose.model('Priorities', prioritiesSchema)

export { Priorities }

// // example
// const priorities = new Priorities({
//   priorities: {
//     'first': '',
//     'second': '',
//     'third': '',
//     'fourth': '',
//     'fifth': '',
//   }
// })
// 
// 
// got to use get and set when accessing values of priorities
// because it's a Map
