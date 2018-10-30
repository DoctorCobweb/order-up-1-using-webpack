import fs from 'fs'
import path from 'path'
import config from './knuckle-dragger-config'
import SerialPort from 'serialport'
import SerialPortStream from '@serialport/stream'
import MockBinding from '@serialport/binding-mock'
import log from 'electron-log'
import parseSingleOrder from './parser'
import colors from 'colors'

////////////////////////////////////////////////////////////
// listenV2.js
// 
// 1. no max limit to buffer size
// 2. buffer resets back to zero size only after successfully
// .  finding a 'cut-op'
// 3. no writing to, and reading from, fs
//
// "just get the bytes from memory and send to parser once a cut op is found"
////////////////////////////////////////////////////////////


// ESC/POS op code for 'select cut mode and cut paper'
// ASCII GS V m=0 => make a full cut
// hex   1d 56 00 
// dec   29 86 00
// this will change for different cut options on
// POS systems => need to get a hexdump of their bytes
// to see exactly what escpos op they're using.
//
// this creates a buffer containing [0x1d, 0x56, 0x0]
// TODO: multiply different paper cut ops could be in use.
// for now, assume there's only one. implement full case later
const PAPER_CUT_OP_BUFFER = Buffer.from([29,86,0])  
const SERIAL_PORT_COM_NAME = config['SERIAL_PORT_COM_NAME']
const areMockingOrders = process.env.MOCK_ORDERS === 'yes' ? true : false
const MOCK_SERIAL_PORT_COM_NAME = '/dev/blah'
let port
let myBuffer = Buffer.alloc(0)

log.transports.file.level = 'info'

const startMockingOrders = () => {
  // START THE MOCKING
  // create mock serialport
  // start sending automatic order to port
  SerialPortStream.Binding = MockBinding
  MockBinding.createPort(MOCK_SERIAL_PORT_COM_NAME, { echo:true, record:true })
  port = new SerialPortStream(MOCK_SERIAL_PORT_COM_NAME)
  
  const writeMockOrderToSerialPort = () => {
    // we have (atm) 51 dockets, each in separate files in mock-orders-manual/
    const randInt = Math.floor(Math.random() * 50 + 1)
    const mockOrderFileName = `order_${randInt}.bin`
    const filePath = path.join(
      __dirname,
      '../app',
      'main-process',
      'knuckle-dragger',
      'mock-orders',
      mockOrderFileName
    )
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      port.write(data, err => {
        if (err) throw err
      })
    })
  }

  setInterval(() => {
    writeMockOrderToSerialPort()
  }, 10000)
}

export default (db) => {
  if (areMockingOrders) {
    // make fake orders without a printer
    startMockingOrders()
  } else {
    // have printer attached and getting 'real' orders
    port = new SerialPort(SERIAL_PORT_COM_NAME)
  }

  port.on('ready', err => {
    if (err) throw err
    console.log('port is ready')
  })

  port.on('error', err => {
    console.log('ERROR: serialport error: ', err.message)
    log.info('ERROR: serialport error: ', err.message)
  })

  port.on('open', err => {
    if (err) {
      console.log('ERROR: opening port: ', err.message)
      log.info('ERROR: opening port: ', err.message)
    }
    console.log(
      'SUCCESS: opened port to device:',
      areMockingOrders? MOCK_SERIAL_PORT_COM_NAME : SERIAL_PORT_COM_NAME)
    log.info(
      'SUCCESS: opened port to device:',
      areMockingOrders? MOCK_SERIAL_PORT_COM_NAME : SERIAL_PORT_COM_NAME)
  })

  port.on('close', err => {
    if (err) {
      console.log('ERROR: on closing port: ', err.message)
    }
    console.log('SUCCESS: closed port')
  })

  // switches the port into 'flowing mode'
  port.on('data', data => {
    // log.info(data)

    // when we are mocking orders during development without a printer
    // serialport sends a 'READY' data payload which mucks up our
    // order parsing. ignore it
    if (areMockingOrders && data.toString() === 'READY') return

    myBuffer = Buffer.concat([myBuffer, data])

    if (haveCutOperator()) {
      handleOrderInBuffer()
    }
  })

  const haveCutOperator = () => {
    if ( myBuffer.includes(PAPER_CUT_OP_BUFFER) ) {
      return true
    } else {
      return false
    }
  }

  const handleOrderInBuffer = () => {
    let cutLocation = myBuffer.indexOf(PAPER_CUT_OP_BUFFER)

    // this tripped me up: the cutLocation is 1 element of the
    // length of the PAPER_CUT_OP_BUFFER => must subtract 1 to
    // get correct location of op_endpt.
    const opEndpoint = cutLocation + (PAPER_CUT_OP_BUFFER.length - 1)
    const start = 0
    const end = opEndpoint + 1
    const orderBuff = getASliceOfBuffer(start, end)

    // console.log('FOUND A PAPER CUT OP...'.green)
    // console.log(`cutLocation: ${cutLocation}, opEndpoint: ${opEndpoint}, myBuffer.length: ${myBuffer.length}`)
    log.info('FOUND A PAPER CUT OP...'.green)
    log.info(`cutLocation: ${cutLocation}, opEndpoint: ${opEndpoint}, myBuffer.length: ${myBuffer.length}`)

    // adjust the buffer to begin at the start of the next order
    readjustBuffer(opEndpoint)

    parseSingleOrder(db, orderBuff)
  }

  const readjustBuffer = opEndpoint => {
    //CAREFUL: we may have the next order already in myBuffer => keep its bytes!
    if (myBuffer.length > opEndpoint) {
      console.log('CAREFUL: have bytes from next order already in buffer. keep them'.red)
      const start = opEndpoint + 1
      const end = myBuffer.length
      myBuffer = getASliceOfBuffer(start, end)
    } else {
      // no extra bytes. should be safe to reset buff to blank
      resetBufferToZero()
    }
  }

  const resetBufferToZero = () => {
    myBuffer = Buffer.alloc(0)
  }

  const getASliceOfBuffer = (start, end) => {
    return myBuffer.slice(start, end)
  }
}