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

// {filterKey: [{spark:,reqId]}, ...], ...}
const subscriptions = {}
// const subscriptions = new Set()

function select(filter, callback) {
  if (filter && filter.limit > 0) {
    db.manyOrNone('SELECT * FROM items ORDER BY timestamp DESC LIMIT $1', [filter.limit])
      .then(items => {
        callback(items)
        // items.reverse().forEach(item => {
        //   spark.write({id: req.id, statement: 'select', value: item})
        // })
      })
      .catch(err => { console.error(err) })
  }
}

const primus = require('primus').createServer(spark => {
  console.log(spark.id, ': connect.')
  spark.on('data', req => {
    console.log(spark.id, ': request:', req)
    if (req.post) {
      const json = req.post
      db.one('INSERT INTO items (json) VALUES ($1) RETURNING *', [json])
        .then(item => {
          console.log('=>', item)
          spark.write({id: req.id, statement: 'insert', value: item})
          // console.log('subscriptions:', subscriptions)
          for (filterKey in subscriptions) {
            if (!subscriptions.hasOwnProperty(filterKey)) continue;
            // FIXME: check if filter match the item (maybe execute SELECT is easy...)
            subscriptions[filterKey].forEach(sub => {
              // sub.spark.write({id: sub.reqId, statement: 'insert', value: item})
              console.log('filterKey:', filterKey)
              select(JSON.parse(filterKey), items => {
                sub.spark.write({id: sub.reqId, statement: 'select', value: items})
              })
            })
          }
        })
    } else if (typeof(req.subscribe) !== 'undefined') {
      // console.log(req)
      const filter = req.subscribe
      const filterKey = JSON.stringify(filter)
      // console.log("subscribe filter:", filter)
      if (!subscriptions[filterKey]) {
        subscriptions[filterKey] = []
      }
      subscriptions[filterKey].push({spark: spark, reqId: req.id})
      console.log('subscriptions:', JSON.stringify(subscriptions))
      select(filter, items => {
        spark.write({id: req.id, statement: 'select', value: items})
      })
      // console.log('subscriptions:', subscriptions)
      // if (filter && filter.limit > 0) {
      //   db.manyOrNone('SELECT * FROM items ORDER BY timestamp DESC LIMIT $1', [filter.limit])
      //     .then(items => {
      //       items.reverse().forEach(item => {
      //         spark.write({id: req.id, statement: 'select', value: item})
      //       })
      //     })
      //     .catch(err => { console.error(err) })
      // }
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

