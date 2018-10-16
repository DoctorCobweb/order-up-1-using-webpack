import express from 'express'

const port = 9999

// requests need to be make by another computer on the *same* WLAN.
// if the app is running on a computer with IP = 10.0.0.4 then
// requests to the sever will look like (using the 'request' npm module):
//
// request('http://10.0.0.4:9999/api/contact, (err, res, body) => {
//   ...
// })
// 
// so we need to make the IP address static for computer running OrderUp

//
// CONCERN: should the server be bundled up in OrderUp application, or
//          be a separate process living elsewhere??

const startSever = () => {
  const app = express()

  app.get('/api/contact', (req,res) => {
    console.log('got a req for /api/contact')
    res.send('hello from /api/contact')
  })

  app.get('/api/test', (req,res) => {
    console.log('got a req for /api/test')
    res.send('hello from /api/test')
  })

  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}

export default startSever