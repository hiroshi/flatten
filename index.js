// const server = require('http').createServer((req, res) => {
// })
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
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres@localhost:5432/ci')
// db.query("select 1")
//   .then(data => {
//     console.log(data)
//   })

const primus = require('primus').createServer(spark => {
  spark.on('data', data => {
    console.log(spark.id, ': data:', data)
    if (data.put) {
      const json = data.put
      console.log('inserting item:', json)
      db.one('INSERT INTO items (json) VALUES ($1) RETURNING id', [json])
        .then(data => {
          console.log('=> id:', data.id)
          // spark.write({id: data.id, value: json})
          primus.write({id: data.id, value: json})
        })
    }
  })
  spark.on('end', () => {
    console.log(spark.id, ': end.')
  })
}, {port:8080, transformer: 'websockets'})
// primus.save(__dirname + '/primus-client.js')
// server.listen(8080, () => {
//   console.log('listen port 8080')
// })





// process.exit(0)

