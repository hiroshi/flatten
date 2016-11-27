// const Primus = require('./primus-client')
// const primus = new Primus()
// primus.
const Primus = require('primus')
const socket = new Primus.createSocket()
const client = socket('http://localhost:8080')

const flat = {
  _callbacks: {},
  _request: function(method, value, callback) {
    const id = String(Math.random())
    this._callbacks[id] = callback
    var req = {id: id}
    req[method] = value
    client.write(req)
  },
  open: function() {
    client.on('data', data => {
      this._callbacks[data.id](data.value)
      delete this._callbacks[data.id]
    })
  },
  post: function(json, callback) {
    // client.write({post: json})
    // if (callback) {
    //   client.on('data', data => {
    //     callback(data)
    //   })
    // }
    this._request('post', json, callback)
  },
  subscribe: function(filter, callback) {
    this._request('subscribe', true, callback)
    // if (callback) {
    //   const id = String(Math.random())
    //   client.write({id: id, subscribe: true})
    //   client.on('data', data => {
    //   })
    // } else {
    //   console.error('missing callback for subscribe().')
    // }
  }
}

flat.open()

flat.post({tags: ['foo', 'bar'], message: 'hello'}, data => {
  console.log('item:', data)
})
