import mongoose from 'mongoose'
// import Course from './course'
const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: String
})
const Course = mongoose.model('Course', courseSchema)

const orderSchema = new Schema({
  name: String,
  clerk: String,
  covers: String,
  customerName: String,
  location: String,
  orderSentAt: String,
  orderTakenUsing: String,
  tableNumber: String,
  variableContent: [String]
  // courses: [{type: Schema.Types.ObjectId, ref: 'Course'}]
})

// add 'speak' functionality to our kitten documents
// MUST COME BEFORE CALL TO mongoose.model aka compiling the model
orderSchema.methods.speak = function () {
  const greeting = this.name
    ? "meow name is " + this.name
    : "i dont have a name"
  console.log(greeting)
}

// using ARROW function wont work here because they dont have a 'this'
// so need to use old ES5 function syntax
// orderSchema.methods.speak = () => {
//   const greeting = this.name // this.name is 'undefined'
//     ? "meow name is " + this.name
//     : "i dont have a name"
//   console.log(greeting) 
// }


export default mongoose.model('Order', orderSchema)

