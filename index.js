const pg = require('pg')
const client = new pg.Client({user: 'postgres', database: 'postgres'})
client.connect(err => {
  if (err) throw err
  client.query('SELECT 1', (err, result) => {
    console.log(result.rows[0])
    client.end(err => {
      if (err) throw err
    })
  })
})
