// import flat from './client.js'
const flat = require('./flat.js')

flat.open()

// flat.subscribe({limit: 3}, (statement, item) => {
//   console.log(statement, ':', item)
// })
const message = process.argv[2]
flat.post({tags: ['foo', 'bar'], message: message}, (statement, item) => {
  console.log(statement, ':', item)
})
