import knuckleDragger from './knuckle-dragger/main'
import { app, BrowserWindow } from 'electron'
import path from 'path'
import url from 'url'
import log from 'electron-log'
import configureStore from '../shared/store/configureStore'

log.transports.file.level = 'info'

// setup our shared electron-redux store.
// => the store on the main process becomes the single source of truth
const store = configureStore()
// store.dispatch({ type:'ADD_ORDER', order:'yadda order'})
console.log('store.getState():', store.getState())

// this setups
// 0. rethinkdb
// 1. serialport to listen
// 2. parse escpos data to make orders
//
// 3. insert order into redux store
knuckleDragger(store)

setInterval(() => {
    // console.log('store.getState(): ', store.getState())
}, 5000)

// To avoid being garbage collected
let winMain
let win1

const APP_MAIN = 'appMain'
const APP_ONE = 'appOne'

app.on('ready', () => {

    let winMain = new BrowserWindow({
        width: 800,
        height: 600,
        x: 0,
        y: 0
    })
    let win1 = new BrowserWindow({
        width: 700,
        height: 500,
        x: 600,
        y: 250
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
