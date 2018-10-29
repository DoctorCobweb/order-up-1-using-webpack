import config from './knuckle-dragger-config'
import SerialPort from 'serialport'
import log from 'electron-log'
import listen from './listen'
import colors from 'colors'

const serialManufacturer = config['SERIAL_MANUFACTURER']
log.transports.file.level = 'info'

export default (db) => {
  startListeningToSerialPort(db)
}

const startListeningToSerialPort = (db) => {
  SerialPort.list()
    .then(ports => {
      console.log('PORTS AVAILABLE: ', ports)
      log.info('PORTS AVAILABLE: ', ports)
      const port = ports.filter(port => port.manufacturer === serialManufacturer)[0]
      if (port) {
        listen(db)
      } else if (process.env.MOCK_ORDERS === 'yes') {
        console.log(colors.blue('we are MOCKING ORDERS...'))
        listen(db)
      } else {
        throw new Error(colors.red('FAILED to find the connection to serial port. Is it plugged into computer?'))
      }
    })
    .catch(err => {
      if (err) throw err
    })
}