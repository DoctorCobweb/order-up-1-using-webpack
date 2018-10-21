import r from 'rethinkdb'
import config from './knuckle-dragger-config'

const dbHost = config['DB_HOST'] 
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName = config['DB_TABLE_NAME']

export const setupDb = () => {
  console.log('in setupDb')

  let conn

  // if this is called then it means no db exists.
  // => meaning we have to create:
  // 1. the db 'orderUp'
  // 2. the tables 
  // .    'orders'
  // .    'courses'
  // .    'items'
  // .    'infos'
  // .    'infoLines'

  return r.connect({host: dbHost, port: dbPort})
    .then(connection => {
      console.log('connected to rethinkdb')
      conn = connection
      return r.dbCreate(dbName).run(conn)
    })
    .then(res => {
      console.log('created "orderUp" db')
      return r.db('orderUp').tableCreate('orders').run(conn)
    })
    .then(res => {
      console.log('created "orders" table')
      return r.db('orderUp').tableCreate('courses').run(conn)
    })
    .then(res => {
      console.log('created "courses" table')
      return r.db('orderUp').tableCreate('items').run(conn)
    })
    .then(res => {
      console.log('created "items" table')
      return r.db('orderUp').tableCreate('infos').run(conn)
    })
    .then(res => {
      console.log('created "infos" table')
      return r.db('orderUp').tableCreate('infoLines').run(conn)
    })
    .then(res => {
      console.log('created "infoLines" table')

    })
    .catch(err => {
      if (err) throw err
    })
}