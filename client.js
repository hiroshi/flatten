// const Primus = require('./primus-client')
// const primus = new Primus()
// primus.
const Primus = require('primus')
const socket = new Primus.createSocket()
const client = socket('http://localhost:8080')
client.write({put: {tags: ['random'], message: 'hello'}})

client.on('data', data => {
  console.log('data:', data)
})
