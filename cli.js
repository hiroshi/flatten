// import flat from './client.js'
const flat = require('./flat.js')

flat.open()

flat.subscribe(null, (statement, item) => {
  console.log(statement, item)
})

flat.post({tags: ['foo', 'bar'], message: 'hello'}, (statement, item) => {
  console.log(statement, item)
})
