const fs = require('fs');
const util = require('util');
const globalConfig = require('./global-config');
const SERIAL_PORT_COM_NAME = globalConfig['SERIAL_PORT_COM_NAME'];
const MAX_BUFFER_SIZE = globalConfig['MAX_BUFFER_SIZE'];
const ESCPOS_DATA_LOG = globalConfig['ESCPOS_DATA_LOG'];
const ESCPOS_SINGLE_ORDER = globalConfig['ESCPOS_SINGLE_ORDER'];
const SerialPort = require('serialport');
const parser = require('./parser');
const parserV2 = require('./parserV2');
const colors = require('colors');
var myBuffer = Buffer.alloc(0);

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


// ------------------------------------------------------------
module.exports.startListening = startListening;
// ------------------------------------------------------------


function startListening () {
  const port = new SerialPort(SERIAL_PORT_COM_NAME);

  port.on('error', function (err) {
    console.log('ERROR: serialport error: ', err.message);
  });

  port.on('open', function (err) {
    if (err) {
      console.log('ERROR: opening port: ', err.message);
    }
    console.log('SUCCESS: opened port to device ', SERIAL_PORT_COM_NAME);
  });

  port.on('close', function (err) {
    if (err) {
      console.log('ERROR: on closing port: ', err.message);
    }
    console.log('SUCCESS: closed the port: ', SERIAL_PORT);
  });

  // switches the port into 'flowing mode'
  port.on('data', function (data) {
    myBuffer = Buffer.concat([myBuffer, data])

    if (myBuffer.length >= MAX_BUFFER_SIZE) {
      //prepare to save buffer to file, but first check to see if
      //it contains the paper cut operator. if it does, just save
      //the order and keep and remaining bytes after it.
      //otherwise, save the whole buffer and upon successful save,
      //reset it.
      console.log('hit/exceeded MAX_BUFFER_SIZE => checking for cut op'.red);

      if (checkForCutOperator()) {
        handleOrderInBuffer();
      } else {
        // reached max buffer size but have no paper cut operator.
        // => save to file and reset buffer to blank
        // since we dont have a cut operation.
        //keep adding bytes to our single order file
        const info = 'REACHED MAX BUFFER: no cut op present...saving buffer then reset it';
        console.log(info.red);
        const start = 0;
        const end = myBuffer.length;
        saveBufferToFile(start, end, haveCutOp=false);
        resetBufferToZero();
      } 
    } else {
      if (checkForCutOperator()) {
        handleOrderInBuffer();
      } else {
        //noop: let 'data' events keep adding more data to myBuffer
      }
    }
  });

  function resetBufferToZero() {
    myBuffer = Buffer.alloc(0);
  }

  function getASliceOfBuffer(start, end) {
    return myBuffer.slice(start,end);
  }

  function handleOrderInBuffer() {
    cutLocation = myBuffer.indexOf(PAPER_CUT_OP_BUFFER);

    // this tripped me up: the cutLocation is 1 element of the
    // length of the PAPER_CUT_OP_BUFFER => must subtract 1 to
    // get correct location of op_endpt.
    const _haveCutOp = true;
    const opEndpt = cutLocation + (PAPER_CUT_OP_BUFFER.length - 1);
    const start = 0;
    const end = opEndpt + 1;
    saveBufferToFile(start, end, haveCutOp=_haveCutOp);

    console.log('FOUND A PAPER CUT OP...'.green);
    console.log('cutLocation: ',
      cutLocation,
      'opEndpt: ',
      opEndpt,
      ' myBuffer.length: ',
      myBuffer.length);

    //CAREFUL: we may have the next order already in myBuffer => keep its bytes!
    if (myBuffer.length > opEndpt) {
      console.log('CAREFUL: have bytes from next order already in buffer. keep them'.red);
      const start = opEndpt + 1;
      const end = myBuffer.length;
      myBuffer = getASliceOfBuffer(start, end);
    } else {
      // no extra bytes. should be safe to reset buff to blank
      resetBufferToZero();
    }
  }

  function checkForCutOperator() {
    if ( myBuffer.includes(PAPER_CUT_OP_BUFFER) ) {
      return true;
    } else {
      return false
    }
  }

  function saveBufferToFile (start, end, haveCutOp=false) {
    // var buff = Buffer.alloc(0);
    // getASliceOfBuffer(start,end).copy(buff);
    const buff = getASliceOfBuffer(start,end); 
    
    if (haveCutOp) {
      try {
        console.log('haveCutOp: ',
          haveCutOp,
          ', appending the bytes from START=',
          start,
          ' to END=',
          end,
          ' (up and including the cut op), to file: ',
          ESCPOS_SINGLE_ORDER);

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
        const appendFile = util.promisify(fs.appendFile);
        const readFile = util.promisify(fs.readFile);
        const truncate = util.promisify(fs.truncate);
        appendFile(ESCPOS_SINGLE_ORDER,buff)
          .then(() => {
            // console.log('promisfy: in first then');
            return readFile(ESCPOS_SINGLE_ORDER);
          })
          .then((results) =>{
            // console.log('promisfy: in second then');
            // console.log(results);
            return appendFile(ESCPOS_DATA_LOG,results);
          })
          .then(() => {
            // console.log('promisfy: in third then');
            return truncate(ESCPOS_SINGLE_ORDER);
          })
          .catch((err) => {
            console.log('ERROR: '.read, err.message);
          });
          */

        //DOESNT WORK
        // get parse erros with this from textualize func
        // const singleOrder = Buffer.concat([fs.readFileSync(ESCPOS_SINGLE_ORDER),buff]);

        //append buff contents to the running single order
        //afterwhich the order should be complete
        fs.appendFileSync(ESCPOS_SINGLE_ORDER, buff);

        // parser.parseOrder(ESCPOS_SINGLE_ORDER);

        //read in the completed single order
        const singleOrder = fs.readFileSync(ESCPOS_SINGLE_ORDER);

        //--------------------------------------------------
        // HANDOFF TIME: this is the major task of listen.js;
        //--------------------------------------------------
        // to hand a single order's worth of bytes to our parser
        // parser.parseSingleOrderOfBytes(singleOrder);

        // demo this
        parserV2.parseSingleOrder(singleOrder);
       
        // make a KEEPSAFE of all single orders
        // write the completed order to the data log
        fs.appendFileSync(ESCPOS_DATA_LOG, singleOrder);


        //clear single file for it to be ready for next stream of bytes from escpos
        fs.truncateSync(ESCPOS_SINGLE_ORDER);
      } catch (e) {
        console.log('haveCutOp: ', 
          haveCutOp,
          ', ERROR appending buff to a file',
          e.message);
      }
    } else {
      //single order is still not complete but buffer is full. append it to single file
      try {
        console.log('haveCutOp: ',
          haveCutOp,
          ', BUFFER FULL: appending entire buffer to single order file');

        fs.appendFileSync(ESCPOS_SINGLE_ORDER, buff);
        /*
        const appendFile = util.promisify(fs.appendFile);
        appendFile(ESCPOS_SINGLE_ORDER, buff)
        .then(() => {})
        .catch((err) => {console.log('ERROR: ', err.message)});
        */
      } catch (e) {
        console.log('haveCutOp: ', 
          haveCutOp,
          ', ERROR appending buff to a file',
          e.message);
      }
    }
  }
}
