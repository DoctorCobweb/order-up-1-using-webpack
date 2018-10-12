import globalConfig from './global-config'
import r from 'rethinkdb'

const dbHost= globalConfig['DB_HOST']
const dbPort = globalConfig['DB_PORT']
const dbName = globalConfig['DB_NAME']
const dbTableName= globalConfig['DB_TABLE_NAME']


export const insertSingleOrder = (order) => {
  // rethinkdb expects an Object to insert

  console.log('in insertSingleOrder... order is:')
  console.log(order)

  // everytime insertSingleOrder is called, as new connection
  // is made to the db. good/bad??
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
