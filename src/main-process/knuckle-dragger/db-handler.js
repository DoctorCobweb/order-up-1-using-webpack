import _ from 'lodash'
import config from './knuckle-dragger-config'
import log from 'electron-log'
import { addOrder } from '../../shared/actions/orders'
import { addToMongoDB } from './mongoose-orders'
import { Order } from './models/models'

const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

log.transports.file.level = 'info'

export const insertSingleOrder = (db, order) => {
  console.log(order)
  // ERROR/BUG: for some reason this get printed many times:
  // 1st order entered, it prints once
  // 2nd order entered, it prints twice
  // 3rd order entered, its prints thrice
  // ....
  // so using the mongodb driver of js instead of Mongoose .watch()
  // functionality.
  // const changeStream = Order.watch().on('change', change => {
  //   console.log('ttttttttt')
  //   console.log(change)
  //   console.log('bbbbbbbb')
  // })
  addToMongoDB(db, order)
}