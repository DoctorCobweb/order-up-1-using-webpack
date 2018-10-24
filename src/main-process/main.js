import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import log from 'electron-log'
import mongoose from 'mongoose'
import knuckleDragger from './knuckle-dragger/main'
import configureStore from '../shared/store/configure-store'
// import startServer from '../server/server'

log.transports.file.level = 'info'

// setup our shared electron-redux store.
// => the store on the main process becomes the single source of truth
const store = configureStore()
// store.dispatch({ type:'ADD_ORDER', order:'yadda order'})
// console.log('store.getState():', store.getState())



mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    // this setups
    // 0. mongodb
    // 1. serialport to listen
    // 2. parse escpos data to make orders
    // 3. inserts order into mongodb

    // start fresh, clear out collections of orders. dev only.
    db.collections.items.drop()
      .then(() => {
          return db.collections.courses.drop()
      })
      .then(() => {
          return db.collections.orders.drop()
      })
      .then(() => {
          console.log('dropped items, courses, then orders, calling knuckleDragger')
          knuckleDragger(db)
      })
      .catch((err) => {
          console.log(err)
          console.log('error: calling knuckleDragger anyway')
          knuckleDragger(db)
      })

    // put change stream stuff here
    // const blahCollection = db.collenction('blahs')
    // const changeStream = blahCollection.watch()
    // changeStream.on('change', change => {
    //     if (change.operationType === 'insert') {
    //         //...
    //     }
    //     if (change.operationType === 'delete') {
    //         // ...
    //     }
    // })
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
