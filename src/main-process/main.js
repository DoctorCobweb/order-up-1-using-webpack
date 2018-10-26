import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import log from 'electron-log'
import mongoose from 'mongoose'
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient
import colors from 'colors'
import knuckleDragger from './knuckle-dragger/main'
import configureStore from '../shared/store/configure-store'
import { Order } from '../shared/models/models'
import stringify from 'json-stringify-pretty-compact'
// import startServer from '../server/server'

log.transports.file.level = 'info'

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
MongoClient.connect(urlMongo, (err,client) => {
    if (err) throw err
    const db = client.db('orderUpDb')
    const collection = db.collection('orders')
    const changeStream = collection.watch()

    console.log(colors.blue('connected to server via MongoClient'))
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
    console.log(colors.blue(results))
    Order.find({_id: results.fullDocument._id})
    .populate({
        path: 'courses',
        model: 'Course',
        populate: {
            path: 'items',
            model: 'Item',
            populate: {
                path: 'infos',
                model: 'Info',
                populate: {
                    path: 'infoLines',
                    model: 'InfoLine'
                    }
            }
        }
    })
    .exec() 
    .then(order => {
        // console.log('stringify(order)')
        console.log(colors.blue(stringify(order)))
    })
    .catch(err => {
        throw err
    }) 
}



// setup our shared electron-redux store.
// => the store on the main process becomes the single source of truth
const store = configureStore()
// store.dispatch({ type:'ADD_ORDER', order:'yadda order'})
// console.log('store.getState():', store.getState())



mongoose.set('bufferCommands', false)
mongoose.connect('mongodb://localhost/orderUpDb?replicaSet=rs', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    // this setups
    // 0. mongodb
    // 1. serialport to listen
    // 2. parse escpos data to make orders
    // 3. inserts order into mongodb

    // start fresh, clear out collections of orders. dev only.
    // db.collections.items.drop()
    //   .then(() => {
    //       return db.collections.courses.drop()
    //   })
    //   .then(() => {
    //       return db.collections.orders.drop()
    //   })
    //   .then(() => {
    //       console.log('dropped items, courses, then orders, calling knuckleDragger')
    //       knuckleDragger(db)
    //   })
    //   .catch((err) => {
    //       console.log(err)
    //       console.log('error: calling knuckleDragger anyway')
    //       knuckleDragger(db)
    //   })
    knuckleDragger()

    // put change stream stuff here for now
    // const orderCollection = db.collection('orders')
    // const changeStream = orderCollection.watch()
    // console.log(colors.blue(changeStream))
    // const changeStream = Order.watch().on('change', change => console.log(change))
})


// start the api server
// startServer()

// To avoid being garbage collected
let winMain
let win1

const APP_MAIN = 'appMain'
const APP_ONE = 'appOne'

app.on('ready', () => {

    let winMain = new BrowserWindow({
        width: 1000,
        height: 700,
        x: 0,
        y: 0
    })
    let win1 = new BrowserWindow({
        width: 900,
        height: 700,
        x: 200,
        y: 80
    })

    const startUrlAppMain = process.env.ELECTRON_APP_MAIN_URL || url.format({
          pathname: path.join(__dirname, `${APP_MAIN}/index.html`),
          protocol: 'file:',
          slashes: true
    });
    const startUrlAppOne = process.env.ELECTRON_APP_ONE_URL || url.format({
          pathname: path.join(__dirname, `${APP_ONE}/index.html`),
          protocol: 'file:',
          slashes: true
    });
    console.log(startUrlAppMain)
    console.log(startUrlAppOne)

    winMain.loadURL(startUrlAppMain)
    win1.loadURL(startUrlAppOne)

    winMain.webContents.openDevTools()
    win1.webContents.openDevTools()

    winMain.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        winMain = null
    })
    win1.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win1= null
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (winMain === null) {
        createWindow()
    }
    if (win1 === null) {
        createWindow()
    }
});
