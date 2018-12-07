import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
import thunk from 'redux-thunk'
// import log from 'electron-log'
import mongoose from 'mongoose'
import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient
import { Order } from '../../shared/models/order'
import config from '../../main-process/knuckle-dragger/knuckle-dragger-config'
import '../../shared/styles/styles.scss'
import AppTwo from './components/AppTwo'

import listsReducer from '../../shared/reducers/lists'
import prioritiesReducer from '../../shared/reducers/priorities'

const initialState = getInitialStateRenderer()
const store = createStore(
  combineReducers({
    lists: listsReducer,
    priorities: prioritiesReducer,
  }),
  initialState,
  compose(applyMiddleware(forwardToMain, thunk))
  // applyMiddleware(forwardToMain)
)
replayActionRenderer(store)


// log.transports.file.level = 'info'

/*
// ----------- MONGODB CHANGE STREAM ----------------
const urlMongo = 'mongodb://localhost/?replicaSet=rs'
MongoClient.connect(urlMongo, { useNewUrlParser: true }, (err,client) => {
    if (err) throw err
    const db = client.db('orderUpDb')
    const collection = db.collection('orders')
    const changeStream = collection.watch()

    console.log('AppMain: connected to server via MongoClient')
    pollStream(changeStream)
})

const pollStream = (cursor) => {
    cursor.next()
      .then(results => {
        //   populateOrderChangeStream(results)
          pollStream(cursor)
      })
      .catch(err => {
          throw err
      })
}

const populateOrderChangeStream = (results) => {
    // console.log(results)
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
        // console.log(order)
        // TODO: send order to redux
    })
    .catch(err => {
        throw err
    }) 
}
*/


mongoose.connect('mongodb://localhost/orderUpDb?replicaSet=rs', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('db mongoose opened event')
})

// Provider will provide the redux store to 
// all components in the app
const jsx = (
  <Provider store={store}>
    <AppTwo />
  </Provider>
)

ReactDOM.render( jsx, document.getElementById('root'))