import _ from 'lodash'
import config from './knuckle-dragger-config'
import r from 'rethinkdb'
import log from 'electron-log'
import { addOrder } from '../../shared/actions/orders'

const dbHost= config['DB_HOST']
const dbPort = config['DB_PORT']
const dbName = config['DB_NAME']
const dbTableName= config['DB_TABLE_NAME']

log.transports.file.level = 'info'

export const insertSingleOrder = (order) => {
  // rethinkdb expects an Object to insert

  // console.log('in insertSingleOrder... order is:')
  // console.log(order)

  let conn

  log.info('in insertSingleOrder... order is:')
  // log.info(order)

  // everytime insertSingleOrder is called, as new connection
  // is made to the db. good/bad??
  r.connect({ host: dbHost, port: dbPort})
    .then(connection => {
      conn = connection
      const orderDoc = {
        metaData: order.metaData
      }
      return r.db('orderUp').table('orders').insert(orderDoc).run(conn)
    })
    .then(orderRes => {
      // console.log('orderRes')
      // console.log(orderRes)
      const orderKey = orderRes.generated_keys[0]
      const courseDocs = Object.keys(order.meals).map(course => ({
        name: course,
        order_id: orderKey
      }))

      console.log('courseDocs')
      console.log(courseDocs)

      return r.db('orderUp').table('courses').insert(courseDocs).run(conn)
    })
    .then(courseDocsRes => {
      // console.log('courseDocsRes')
      // console.log(courseDocsRes)
      const zippedCoursesWithKeys = _.zip(courseDocsRes.generated_keys, _.values(order.meals))
      const itemDocs = _.flatten(zippedCoursesWithKeys.map(zippedCourse => {
        const [ courseKey, courseItems ] = zippedCourse
        return courseItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          course_id: courseKey
        }))
      }))

      console.log('itemDocs')
      console.log(itemDocs)

      return r.db('orderUp').table('items').insert(itemDocs).run(conn)
    })
    .then(itemDocsRes => {
      // console.log('itemDocsRes')
      // console.log(itemDocsRes)

      // [ [{entree_item},{entree_item}], [{mains_item},{mains_item}], ...]
      const eachCoursesItems = _.values(order.meals)

      // [ {entree_item},{entree_item}, {mains_item},{mains_item}, ...]
      const flatItems = _.flatten(eachCoursesItems)

      // [[item_key, {entree_item}], [item_key, {entree_item}], [item_key,{mains_item}], ...]
      const zipped = _.zip(itemDocsRes.generated_keys, flatItems)

      const itemInfos = _.flatten(zipped.map(zippedItem => {
        const [ itemKey, item ] = zippedItem
        return item.info.map(info => ({
          item_id: itemKey
        }))
      }))

      console.log('itemInfos')
      console.log(itemInfos)

      return r.db('orderUp').table('infos').insert(itemInfos).run(conn)
    })
    .then(infoDocsRes => {
      // console.log('infoDocsRes')
      // console.log(infoDocsRes)

      // [{item}, {item}, ...]
      const allItems = _.flatten(_.values(order.meals))

      // [ [info], [info], ... ]
      const allInfos = _.flatten(allItems.map(item => item.info))

      // console.log('allInfos')
      // console.log(allInfos)

      // [ [ info_key, {itemInfo: [{info:'...', quantity: ''}]} ], [...], ... ]
      const allInfosZipped = _.zip(infoDocsRes.generated_keys, allInfos)
      const allInfoLines = _.flatten(allInfosZipped.map( elem => {
        const [ infoKey, itemInfoObj ] = elem
        return itemInfoObj.itemInfo.map(singleItemInfoLine => ({
          info_id: infoKey,
          name: singleItemInfoLine.info,
          quatity: singleItemInfoLine.quantity
        }))
      }))

      console.log('allInfoLines')
      console.log(JSON.stringify(allInfoLines, null, 2))

      return r.db('orderUp').table('infoLines').insert(allInfoLines).run(conn)
    })
    .then(infoLinesRes => {
      console.log('infoLinesRes')
      console.log(infoLinesRes)
    })
    .catch(err => {
      if (err) throw err
    })
}


//   r.connect({ host: dbHost, port: dbPort})
//     .then(conn => {
//       return r.db(dbName).table(dbTableName).insert(order).run(conn)
//     })
//     .then(results => {
//       console.log('SUCCESS: inserted a single order')
//       console.log(results)
//       log.info('SUCCESS: inserted a single order')
//       log.info(results)
//       // const orderWithDbKey = {
//       //   ...order,
//       //   id: results.generated_keys[0]
//       // }
//       // store.dispatch(addOrder(orderWithDbKey))
//       // console.log(store)
//     })
//     .catch(err => {
//       if (err) throw err
//     })
// }