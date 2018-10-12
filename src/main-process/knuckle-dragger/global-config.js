const config = {
  "ESCPOS_SINGLE_ORDER": "escpos-single-order.bin",
  "ESCPOS_DATA_LOG": "escpos-data-log.bin",
  "MAX_BUFFER_SIZE": 5096,
  "SERIAL_PORT_COM_NAME": "/dev/tty.usbserial",
  "SERIAL_MANUFACTURER" : "Prolific Technology Inc. ",
  "DB_HOST": "localhost",
  "DB_PORT":28015,
  "DB_NAME":"orderUp",
  "DB_TABLE_NAME":"orders",
}

// ------------------------------------------------------------
module.exports = config;
// ------------------------------------------------------------
