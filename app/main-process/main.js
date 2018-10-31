import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import log from 'electron-log'
import SerialPort from 'serialport'
import mongoose from 'mongoose'
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient
import colors from 'colors'
import knuckleDragger from './knuckle-dragger/main'
import configureStore from '../shared/store/configure-store'
import { Order } from '../shared/models/models'
import { startAddOrder } from '../shared/actions/orders'

import stringify from 'json-stringify-pretty-compact'
// import startServer from '../server/server'


log.transports.file.level = 'info'




if (process.env.NODE_ENV === 'development') {
  console.log('in main.js and NODE_ENV is development')
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

// -------------------------- ELECTRON-REDUX STORE ------------------------------
// setup our shared electron-redux store.
// => the store on the main process becomes the single source of truth
const store = configureStore()


// ------------------------- CHANGE STREAMS (important) -------------------------
// we use the mongodb driver (instead of Mongoose .watch()) for change streams.
// had two issues with Mongoose .watch() which were:
// 
// 1. .watch() depended on where in the project it was written.
//   it didn't work putting it directly inside the db.once('open', cb) cb,
//   which is what the docs recommended. but it works (albeit see pt 2 below) 
//   when put in db-handler.js file, mongoose-orders.js file, or mongoose-playground.js
//   tried to disable buffering of commands in mongoose as so as to not allow useage of models
//   , and thus change streams, until there actually was a db connection, but this didn't help.
//
// 2. .watch() is triggered multiple times. the first order that is inserted triggers
//    it once, the second order inserted triggers .watch() twice, the third order inserted
//    triggers it three times, etc etc. 
//
// i dont understand nor trust .watch() enough to use it in production. so at the 
// expense of some extra code and an additional mongo connection, we prefer the MongoClient
// methods instead.      
// so using the mongodb driver of js instead of Mongoose .watch()
// functionality.
//
const urlMongo = 'mongodb://localhost/?replicaSet=rs'
MongoClient.connect(urlMongo, (err, client) => {
  if (err) throw err
  const db = client.db('orderUpDb')
  const collection = db.collection('orders')
  const changeStream = collection.watch()

  console.log(colors.blue('main-process: connected to server via MongoClient'))
  // console.log(colors.blue(db.collection('orders')))
  pollStream(changeStream)
})

const pollStream = (cursor) => {
  cursor.next()
    .then(results => {
      populateOrderChangeStream(results)
      pollStream(cursor)
    })
    .catch(err => {
      throw err
    })
}

const populateOrderChangeStream = (results) => {
  const newOrderId = results.fullDocument._id
  
  console.log(colors.blue('MAIN PROCESS: change stream. new order avail, dispatching to startAddOrder actionas'))
  store.dispatch(startAddOrder(newOrderId))
}

mongoose.set('bufferCommands', false)
mongoose.connect('mongodb://localhost/orderUpDb?replicaSet=rs', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  // this sets up:
  // 0. mongodb
  // 1. serialport to listen
  // 2. parse escpos data to make orders
  // 3. inserts order into mongodb

  // start fresh, clear out collections of orders. dev only.
  // db.collections.items.drop()
  //   .then(() => {
  //     return db.collections.courses.drop()
  //   })
  //   .then(() => {
  //     return db.collections.orders.drop()
  //   })
  //   .then(() => {
  //     console.log('dropped items, courses, then orders, calling knuckleDragger')
  //     knuckleDragger(db)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     console.log('error: calling knuckleDragger anyway')
  //     knuckleDragger(db)
  //   })
  knuckleDragger()
})


// start the api server
// startServer()

// To avoid being garbage collected
let winMain
let winOne

app.on('ready', () => {

  let winMain = new BrowserWindow({
    width: 800,
    height: 900,
    x: 800,
    y: 100
  })
  // let winOne = new BrowserWindow({
  //   width: 700,
  //   height: 700,
  //   x: 200,
  //   y: 80
  // })

  let appMainUrl = url.format({
    pathname: path.join(__dirname, 'renderer-process', 'appMain', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  // let appOneUrl = url.format({
  //   pathname: path.join(__dirname, 'renderer-process', 'appOne', 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // })

  winMain.loadURL(appMainUrl)
  // winOne.loadURL(appOneUrl)

  winMain.webContents.openDevTools()
  // winOne.webContents.openDevTools()

  winMain.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winMain = null
  })
  // winOne.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // winOne= null
  // })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (winMain === null) {
    createWindow()
  }
  // if (winOne === null) {
  //   createWindow()
  // }
})