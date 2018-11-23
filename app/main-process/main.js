import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import log from 'electron-log'
import SerialPort from 'serialport'
import mongoose from 'mongoose'
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient
import uuidv1 from 'uuid/v1' // timestamp (UTC) version of uuid
import colors from 'colors'
import knuckleDragger from './knuckle-dragger/main'
import configureStore from '../shared/store/configure-store'
// import { Order } from '../shared/models/order'
// import { List } from '../shared/models/list'
import { startAddOrderToLists } from '../shared/actions/lists'

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
  // console.log(results)
  if (results.operationType === 'insert') {
    const newOrderId = results.fullDocument._id
    console.log(
      colors.blue(
        'MAIN PROCESS: change stream. new order avail, dispatching to startAddOrder actionas'
      )
    )

    // every time a new order arrives we need todo:
    //
    // NB. order is already in mongodb when it gets here.
    //    mongoose-orders.js has created and saved it to mongodb,
    //    then the change stream is called above with the 'insert'
    //    operationType. we say this because the first thing that
    //    'startAddOrderToLists' func does is find the order in mongodb
    //
    // 1. add id to state.lists.lists['new-orders'].orderIds (mongo)
    // 2. add the populated order to state.lists.orders (redux)
    store.dispatch(startAddOrderToLists(newOrderId))

  } else if (results.operationType === 'deleted') {
    console.log('TODO: we deleted an order or many orders.'.red)
  } else {
    console.log(`TODO: operationType was ${results.operationType}`.red)
  }
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
  knuckleDragger()
})


// start the api server
// startServer()

// To avoid being garbage collected
let winMain
let winOne
let winTwo
let winThree

const createWindow = () => {
  let winMain = new BrowserWindow({
    width: 1300,
    height: 1000,
    x: 0,
    y: 0 
  })
  let winOne = new BrowserWindow({
    width: 1300,
    height: 1000,
    x: 1305,
    y: 0
  })
  let winTwo = new BrowserWindow({
    width: 1200,
    height: 1000,
    x: 2610,
    y: 0
  })
  let winThree= new BrowserWindow({
    width: 1915,
    height: 1000,
    x: 1925,
    y: 0 
  })

  let appMainUrl = url.format({
    pathname: path.join(__dirname, 'renderer-process', 'appMain', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  let appOneUrl = url.format({
    pathname: path.join(__dirname, 'renderer-process', 'appOne', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  let appTwoUrl = url.format({
    pathname: path.join(__dirname, 'renderer-process', 'appTwo', 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  let appThreeUrl = url.format({
    pathname: path.join(__dirname, 'renderer-process', 'appThree', 'index.html'),
    protocol: 'file:',
    slashes: true
  })

  winMain.loadURL(appMainUrl)
  winOne.loadURL(appOneUrl)
  winTwo.loadURL(appTwoUrl)
  winThree.loadURL(appThreeUrl)

  winMain.webContents.openDevTools()
  // winOne.webContents.openDevTools()
  winTwo.webContents.openDevTools()
  winThree.webContents.openDevTools()

  winMain.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winMain = null
  })
  winOne.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winOne= null
  })
  winTwo.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winTwo= null
  })
  winThree.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    winThree= null
  })
}

app.on('ready', () => {
  createWindow()
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
  if (winOne === null) {
    createWindow()
  }
  if (winTwo === null) {
    createWindow()
  }
  if (winThree === null) {
    createWindow()
  }
})
