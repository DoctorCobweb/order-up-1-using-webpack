import globalConfig from './global-config'
import SerialPort from 'serialport'
import r from 'rethinkdb'
import log from 'electron-log'
import listen from './listenV2'

const dbHost = globalConfig['DB_HOST'] 
const dbPort = globalConfig['DB_PORT']
const dbName = globalConfig['DB_NAME']
const dbTableName = globalConfig['DB_TABLE_NAME']
const serialManufacturer = globalConfig['SERIAL_MANUFACTURER']

log.transports.file.level = 'info'

let store

export default (_store) => {
  store = _store
  r.connect({
    host: dbHost,
    port:dbPort
    })
    .then(conn => {
      //check to see if the 'orderUp' db already exists.
      //if so, skip creating it
      r.dbList().run(conn)
        .then(results => {
          const dbMatches = results.filter(result => result === dbName)
          if (dbMatches.length > 0) {
            console.log(dbName, 'db already exists. skip creating it')
            createOrderUpTableMaybe(conn)
          } else {
            //need to create the db
            console.log(dbName, 'db does NOT exist ===> going to create it now...')
            createOrderUpDb(conn)
          }
        })
        .catch(err => {
          if (err) throw err
        })
    })
    .catch(err => {
      if (err) throw err
    })
}

const createOrderUpDb = (conn) => {
  r.dbCreate(dbName).run(conn)
    .then(result => {
      console.log('SUCCESS: created db: ', dbName)
      console.log(result)
      createOrderUpTableMaybe(conn)
    })
    .catch(err => {
      if (err) throw err
    })
}

const createOrderUpTableMaybe = (conn) => {
  //the db exists. must check if the table exist
  r.db(dbName).tableList().run(conn)
    .then(results => {
      const tableMatches = results.filter(result => result === dbTableName)
      if (tableMatches.length > 0) {
        console.log(dbTableName, 'table already exists. skip creating it')
        startListeningToSerialPort(conn)
      } else {
        console.log(dbTableName, 'does NOT exist ===> going to create it now...')
        createOrderUpTable(conn)
      }
    })
    .catch(err => {
      if (err) throw err
    })
}

const createOrderUpTable =  (conn) => {
  r.db(dbName).tableCreate(dbTableName).run(conn)
    .then(result => {
      console.log('SUCCESS: created the ', dbTableName, ' table')
      startListeningToSerialPort(conn)
    })
    .catch(err => {
      if (err) throw err
    })
}

const startListeningToSerialPort = (conn) => {
  if (process.env.MOCK_ORDERS === 'yes') {
    console.log('mocking')
    log.info('mocking')
    listen(store, { mocking: true })
  } else {
    console.log('not mocking')
    log.info('not mocking')
    // we are connected to a physical machine
    // either i) docket-mocker app is running on home dev comp
    // or ii) have real-world use scenario, connected to kitchen printer
    SerialPort.list()
      .then(ports => {
        console.log('PORTS AVAILABLE: ', ports)
        log.info('PORTS AVAILABLE: ', ports)
        const port = ports.filter(port => port.manufacturer === serialManufacturer)[0]
        if (port) {
          listen(store, { mocking: false })
        }
      })
      .catch(err => {
        if (err) throw err
      })
  }
}