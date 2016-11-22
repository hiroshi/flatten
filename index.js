// const server = require('http').createServer((req, res) => {
// })

const primus = require('primus').createServer(spark => {
  spark.on('data', data => {
    console.log(spark.id, ': data:', data)
    // spark.write(data)
    if (data.put) {
      console.log('TODO insert item:', data.put)
    }
  })
  spark.on('end', () => {
    console.log(spark.id, ': end.')
  })
}, {port:8080, transformer: 'websockets'})
primus.save(__dirname + '/primus-client.js')
// server.listen(8080, () => {
//   console.log('listen port 8080')
// })





// process.exit(0)

// const pg = require('pg')
// const client = new pg.Client({user: 'postgres', database: 'postgres'})
// client.connect(err => {
//   if (err) throw err
//   client.query('SELECT 1', (err, result) => {
//     console.log(result.rows[0])
//     client.end(err => {
//       if (err) throw err
//     })
//   })
// })
