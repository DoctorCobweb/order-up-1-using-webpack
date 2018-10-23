const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  // we're connected
  const kittySchema = new mongoose.Schema({
    name: String
  })

  // add 'speak' functionality to our kitten documents
  // MUST COME BEFORE CALL TO mongoose.model aka compiling the model
  kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "meow name is " + this.name
      : "i dont have a name"
    console.log(greeting)
  }

  // using ARROW function wont work here because they dont have a 'this'
  // so need to use old ES5 function syntax
  // kittySchema.methods.speak = () => {
  //   const greeting = this.name // this.name is 'undefined'
  //     ? "meow name is " + this.name
  //     : "i dont have a name"
  //   console.log(greeting) 
  // }
  const Kitten = mongoose.model('Kitten', kittySchema)
  const silence = new Kitten({name: 'Silence'})

  // save the kitten document to db
  silence.save((err, silence) => {
    if (err) return console.error(err)
    silence.speak()
    console.log(`silence.name: ${silence.name}`)
  })

  // find all kitten documents in db
  Kitten.find((err, kittens) => {
    if (err) return console.error(err)
    console.log(kittens)
  })


})