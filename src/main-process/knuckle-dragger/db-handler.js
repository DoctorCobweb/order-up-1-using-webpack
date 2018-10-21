import config from './knuckle-dragger-config'
import r from 'rethinkdb'
import log from 'electron-log'
import { addOrder } from '../../shared/actions/orders'

const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

log.transports.file.level = 'info'

let store

export const insertSingleOrder = (order, _store) => {
  store = _store
  // rethinkdb expects an Object to insert

  console.log('in insertSingleOrder... order is:')
  console.log(order)

  log.info('in insertSingleOrder... order is:')
  log.info(order)

  // everytime insertSingleOrder is called, as new connection
  // is made to the db. good/ba??
  r.connect({
    host: dbHost,
    port: dbPort
  })
  .then(conn => {
    r.db(dbName).table(dbTableName)
      .insert(order)
      .run(conn)
      .then(results => {
        console.log('SUCCESS: inserted a single order')
        console.log(results)
        log.info('SUCCESS: inserted a single order')
        log.info(results)
        // console.log(store)
        const orderWithDbKey = {
          ...order,
          id: results.generated_keys[0]
        }
        store.dispatch(addOrder(orderWithDbKey))
        // console.log(store.getState())
      })
      .catch(err => {
        if (err) throw err
      })
  })
  .catch(err => {
    if (err) throw err
  })
}

export const insertManyOrders = (orders) => {
  //orders is an array of arrays of strings
  //[['blah','yadda',...,'foo'], ['blah', 'yadda',...,'foo'],....]
  console.log('heeloo from insertManyOrders')
}
