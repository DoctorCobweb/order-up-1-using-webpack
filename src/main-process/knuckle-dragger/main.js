import config from './knuckle-dragger-config'
import SerialPort from 'serialport'
import log from 'electron-log'
import listen from './listen'

const serialManufacturer = config['SERIAL_MANUFACTURER']
log.transports.file.level = 'info'

export default (db) => {
  startListeningToSerialPort(db)
}

const startListeningToSerialPort = (db) => {
  if (process.env.MOCK_ORDERS === 'yes') {
    listen(db, { mocking: true })
  } else {
    // we are connected to a physical machine
    // either i) docket-mocker app is running on home dev comp
    // or ii) have real-world use scenario, connected to kitchen printer
    SerialPort.list()
      .then(ports => {
        console.log('PORTS AVAILABLE: ', ports)
        log.info('PORTS AVAILABLE: ', ports)
        const port = ports.filter(port => port.manufacturer === serialManufacturer)[0]
        if (port) {
          listen(db, { mocking: false })
        }
      })
      .catch(err => {
        if (err) throw err
      })
  }
}