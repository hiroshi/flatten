// import flat from './client.js'
const flat = require('./flat.js')

flat.open()

flat.subscribe(null, item => {
  console.log('new item:', item)
})

flat.post({tags: ['foo', 'bar'], message: 'hello'}, item => {
  console.log('item:', item)
})
