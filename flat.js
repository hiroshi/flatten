// const Primus = require('./primus-client')
// const primus = new Primus()
// primus.
const Primus = require('./primus-client.js')
// const socket = new Primus.createSocket()
// const client = socket('http://localhost:8080')
const client = Primus.connect('http://localhost:8080')

const flat = {
  _callbacks: {},
  _request: function(method, value, callback) {
    const id = String(Math.random())
    const req = {id: id}
    this._callbacks[id] = {callback: callback, once: method === 'post'}
    req[method] = value
    client.write(req)
  },
  open: function() {
    client.on('data', data => {
      callback = this._callbacks[data.id]
      callback.callback(data.statement, data.value)
      if (callback.once) {
        delete this._callbacks[data.id]
      }
    })
  },
  post: function(json, callback) {
    this._request('post', json, callback)
  },
  subscribe: function(filter, callback) {
    this._request('subscribe', filter, callback)
  }
}
module.exports = flat

