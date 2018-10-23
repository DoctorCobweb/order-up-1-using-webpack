const r = require('rethinkdb')

let conn 

r.connect({host: 'localhost', port: 28015})
  .then(connection => {
    conn = connection
    makeQuery()
  })
  .catch(err => {
    if (err) throw err
})

const makeQuery = () => {

  const joinCourseWithOrders = r.db('orderUp').table('orders').merge(order => {
    return { courses: r.db('orderUp').table('courses').filter(course => {
      return course('order_id').eq(order('id'))}).coerceTo('array')
    }
  })

  const currentQuery = r.db('orderUp').table('orders')
    .outerJoin(r.db('orderUp').table('courses'), (order, course) => {
      return order('id').eq(course('order_id'))
    })

  runQuery(currentQuery)
}

const runQuery = query => {
  query.run(conn)
  .then(res => {
    return res.toArray()
  })
  .then(res => {
    console.log(JSON.stringify(res, null, 2))
  })
  .catch(err => {
    if (err) throw err
  })
}


const _makeQuery = () => {
  r.db('orderUp').table('orders').run(conn)
    .then(res => {
      return res.toArray()
    })
    .then(res => {
      console.log(JSON.stringify(res, null, 2))
    })
    .catch(err => {
      if (err) throw err
    })
}



