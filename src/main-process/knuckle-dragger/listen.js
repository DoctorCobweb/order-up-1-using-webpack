import fs from 'fs'
import path from 'path'
import globalConfig from './global-config'
import SerialPort from 'serialport'
import parseSingleOrder from './parserV2'
import colors from 'colors'

const SERIAL_PORT_COM_NAME = globalConfig['SERIAL_PORT_COM_NAME']
const MAX_BUFFER_SIZE = globalConfig['MAX_BUFFER_SIZE']
const ESCPOS_DATA_LOG = globalConfig['ESCPOS_DATA_LOG']
const ESCPOS_SINGLE_ORDER = globalConfig['ESCPOS_SINGLE_ORDER']

let myBuffer = Buffer.alloc(0)

// ESC/POS op code for 'select cut mode and cut paper'
// ASCII GS V m=0 => make a full cut
// hex   1d 56 00 
// dec   29 86 00
// this will change for different cut options on
// POS systems => need to get a hexdump of their bytes
// to see exactly what escpos op they're using.
//
// this creates a buffer containing [0x1d, 0x56, 0x00]
// TODO: multiply different paper cut ops could be in use.
// for now, assume there's only one. implement full case later
const PAPER_CUT_OP_BUFFER = Buffer.from([29,86,0])  
let store
let port

const areMockingOrders = process.env.MOCK_ORDERS
const MOCK_SERIAL_PORT_COM_NAME = '/dev/blah'

const startMockingOrders = () => {
  // START THE MOCKING
  // create mock serialport
  // start sending automatic order to port
  const escpos = require('escpos')
  const _SerialPort = require('@serialport/stream')
  const MockBinding = require('@serialport/binding-mock')
  const MOCK_ORDER_FILENAME = 'order_466.bin'
  
  _SerialPort.Binding = MockBinding
  MockBinding.createPort(MOCK_SERIAL_PORT_COM_NAME, { echo:true, record:true })
  port = new _SerialPort(MOCK_SERIAL_PORT_COM_NAME)
  
  // make mock orders and write then to fs
  // const mockOrderHandler = (data) => {
  //   fs.writeFileSync(MOCK_ORDER_FILENAME, data)
  // }
  // const device = new escpos.Console(mockOrderHandler)
  // const printer = new escpos.Printer(device, {})
  // const mockOrder = () => {
  //   device.open(() => {
  //     printer
  //     .font('a')
  //     .align('ct')
  //     .style('bu')
  //     .size(1,1)
  //     .text('blah')
  //     .close()
  //   })
  // }
  
  const writeMockOrderToSerialPort = () => {
    const mockOrder = fs.readFileSync(MOCK_ORDER_FILENAME)
    // const filePath = path.join(
    //   __dirname,
    //   'scr/main-process/knuckle-dragger/mock-orders-manual/order_10.bin'
    // ) 
    // const mockOrder = fs.readFileSync('src/order_10.bin')
    port.write(mockOrder, err => {
      if (err) throw err
    })
  }

  setInterval(() => {
    writeMockOrderToSerialPort()
  }, 4000)
}

export default (_store, { mocking=false }) => {
  store = _store

  if (mocking) {
    // make fake orders without a printer
    startMockingOrders()
  } else {
    // have printer attached and getting 'real' orders
    port = new SerialPort(SERIAL_PORT_COM_NAME)
  }

  port.on('ready', (err) => {
    if (err) throw err
    console.log('port is ready')
  })

  port.on('error', (err) => {
    console.log('ERROR: serialport error: ', err.message)
  })

  port.on('open', (err) => {
    if (err) {
      console.log('ERROR: opening port: ', err.message)
    }
    console.log(
      'SUCCESS: opened port to device:',
      areMockingOrders? MOCK_SERIAL_PORT_COM_NAME : SERIAL_PORT_COM_NAME)
  })

  port.on('close', (err) => {
    if (err) {
      console.log('ERROR: on closing port: ', err.message)
    }
    console.log('SUCCESS: closed port')
  })

  // switches the port into 'flowing mode'
  port.on('data', (data) => {

    // when we are mocking orders during development without a printer
    // serialport sends a 'READY' data payload which mucks up our
    // order parsing. ignore it
    if (areMockingOrders && data.toString() === 'READY') return

    myBuffer = Buffer.concat([myBuffer, data])

    if (myBuffer.length >= MAX_BUFFER_SIZE) {
      //prepare to save buffer to file, but first check to see if
      //it contains the paper cut operator. if it does, just save
      //the order and keep and remaining bytes after it.
      //otherwise, save the whole buffer and upon successful save,
      //reset it.
      console.log('hit/exceeded MAX_BUFFER_SIZE => checking for cut op'.red)

      if (checkForCutOperator()) {
        handleOrderInBuffer()
      } else {
        // reached max buffer size but have no paper cut operator.
        // => save to file and reset buffer to blank
        // since we dont have a cut operation.
        //keep adding bytes to our single order file
        const info = 'REACHED MAX BUFFER: no cut op present...saving buffer then reset it'
        console.log(info.red)
        const start = 0
        const end = myBuffer.length
        saveBufferToFile(start, end, haveCutOp=false)
        resetBufferToZero()
      } 
    } else {
      if (checkForCutOperator()) {
        handleOrderInBuffer()
      } else {
        //noop: let 'data' events keep adding more data to myBuffer
      }
    }
  })

  const resetBufferToZero = () => {
    myBuffer = Buffer.alloc(0)
  }

  const getASliceOfBuffer = (start, end) => {
    return myBuffer.slice(start,end)
  }

  const handleOrderInBuffer = () => {
    let cutLocation = myBuffer.indexOf(PAPER_CUT_OP_BUFFER)

    // this tripped me up: the cutLocation is 1 element of the
    // length of the PAPER_CUT_OP_BUFFER => must subtract 1 to
    // get correct location of op_endpt.
    const haveCutOp = true
    const opEndpt = cutLocation + (PAPER_CUT_OP_BUFFER.length - 1)
    const start = 0
    const end = opEndpt + 1
    saveBufferToFile(start, end, haveCutOp)

    console.log('FOUND A PAPER CUT OP...'.green)
    console.log('cutLocation: ',
      cutLocation,
      'opEndpt: ',
      opEndpt,
      ' myBuffer.length: ',
      myBuffer.length)

    //CAREFUL: we may have the next order already in myBuffer => keep its bytes!
    if (myBuffer.length > opEndpt) {
      console.log('CAREFUL: have bytes from next order already in buffer. keep them'.red)
      const start = opEndpt + 1
      const end = myBuffer.length
      myBuffer = getASliceOfBuffer(start, end)
    } else {
      // no extra bytes. should be safe to reset buff to blank
      resetBufferToZero()
    }
  }

  const checkForCutOperator = () => {
    if ( myBuffer.includes(PAPER_CUT_OP_BUFFER) ) {
      return true
    } else {
      return false
    }
  }

  const saveBufferToFile = (start, end, haveCutOp=false) => {
    // var buff = Buffer.alloc(0)
    // getASliceOfBuffer(start,end).copy(buff)
    const buff = getASliceOfBuffer(start,end)
    
    if (haveCutOp) {
      try {
        console.log('haveCutOp: ',
          haveCutOp,
          ', appending the bytes from START=',
          start,
          ' to END=',
          end,
          ' (up and including the cut op), to file: ',
          ESCPOS_SINGLE_ORDER)

        //COMMENT OUT ASYNC CODE FOR NOW.
        // => it's easier to reason about sync code
        // and i'm worried about using a global buffer
        // to save asynchronously whicls resetting it
        // elsewhere in the code.
        //
        // need to rethink this somemore...(!)
        //
        // ...for now it works.
        /*
        const appendFile = util.promisify(fs.appendFile)
        const readFile = util.promisify(fs.readFile)
        const truncate = util.promisify(fs.truncate)
        appendFile(ESCPOS_SINGLE_ORDER,buff)
          .then(() => {
            // console.log('promisfy: in first then')
            return readFile(ESCPOS_SINGLE_ORDER)
          })
          .then((results) =>{
            // console.log('promisfy: in second then')
            // console.log(results)
            return appendFile(ESCPOS_DATA_LOG,results)
          })
          .then(() => {
            // console.log('promisfy: in third then')
            return truncate(ESCPOS_SINGLE_ORDER)
          })
          .catch((err) => {
            console.log('ERROR: '.read, err.message)
          })
          */

        //DOESNT WORK
        // get parse erros with this from textualize func
        // const singleOrder = Buffer.concat([fs.readFileSync(ESCPOS_SINGLE_ORDER),buff])

        //append buff contents to the running single order
        //afterwhich the order should be complete
        fs.appendFileSync(ESCPOS_SINGLE_ORDER, buff)

        //read in the completed single order
        const singleOrder = fs.readFileSync(ESCPOS_SINGLE_ORDER)

        //--------------------------------------------------
        // HANDOFF TIME: this is the major task of listen.js
        //--------------------------------------------------
        // to hand a single order's worth of bytes to our parser
        // parser.parseSingleOrderOfBytes(singleOrder)
        parseSingleOrder(singleOrder, store)

        // REVISIT LATER... cant find file error
        // just generate some 
        // const randInt = Math.floor(Math.random() * 1000)
        // const filePath = path.join(
        //   __dirname,
        //   'src',
        //   'main-process',
        //   'knuckle-dragger',
        //   'mock-orders')
        // console.log('writing single file')
        // console.log(`${filePath}/order_${randInt}.bin`)
        // fs.writeFileSync(`order_${randInt}.bin`, singleOrder)
       
        // make a KEEPSAFE of all single orders
        // write the completed order to the data log
        fs.appendFileSync(ESCPOS_DATA_LOG, singleOrder)

        //clear single file for it to be ready for next stream of bytes from escpos
        fs.truncateSync(ESCPOS_SINGLE_ORDER)
      } catch (e) {
        console.log('haveCutOp: ', 
          haveCutOp,
          ', ERROR appending buff to a file',
          e.message)
      }
    } else {
      //single order is still not complete but buffer is full. append it to single file
      try {
        console.log('haveCutOp: ',
          haveCutOp,
          ', BUFFER FULL: appending entire buffer to single order file')

        fs.appendFileSync(ESCPOS_SINGLE_ORDER, buff)
        /*
        const appendFile = util.promisify(fs.appendFile)
        appendFile(ESCPOS_SINGLE_ORDER, buff)
        .then(() => {})
        .catch((err) => {console.log('ERROR: ', err.message)})
        */
      } catch (e) {
        console.log('haveCutOp: ', 
          haveCutOp,
          ', ERROR appending buff to a file',
          e.message)
      }
    }
  }
}