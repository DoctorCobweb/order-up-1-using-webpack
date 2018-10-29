import _ from 'lodash'
import config from './knuckle-dragger-config'
import log from 'electron-log'
import { addOrder } from '../../shared/actions/orders'
import { addToMongoDB } from './mongoose-orders'

const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

log.transports.file.level = 'info'

export const insertSingleOrder = (db, order) => {
  // console.log(order)
  addToMongoDB(db, order)
}