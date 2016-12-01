// import flat from './client.js'
const flat = require('./flat.js')

flat.open()

// flat.subscribe({limit: 3}, (statement, item) => {
//   console.log(statement, ':', item)
// })

flat.post({tags: ['foo', 'bar'], message: 'world'}, (statement, item) => {
  console.log(statement, ':', item)
})
