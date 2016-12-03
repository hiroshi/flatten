const pgp = require('pg-promise')()
const db = pgp('postgres://postgres@localhost:5432/ci')

const PubSub = {
  _subscriptions: [],
  subscribe: function(filter, spark, reqId) {
    this._subscriptions.push({filter: filter, spark: spark, reqId: reqId})
    select(filter, items => {
      spark.write({id: reqId, statement: 'select', value: items})
    })
  },
  unsubscribe: function(spark) {
    this._subscriptions = this._subscriptions.filter(sub => {
      return sub.spark !== spark
    })
  },
  publish: function() {
    console.log('PubSub.publish: num subs', this._subscriptions.length)
    this._subscriptions.forEach(sub => {
      select(sub.filter, items => {
        sub.spark.write({id: sub.reqId, statement: 'select', value: items})
      })
    })
  }
}

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
  console.log(spark.id, ': client connected.')
  spark.on('data', req => {
    if (req.post) {
      const json = req.post
      db.one('INSERT INTO items (json) VALUES ($1) RETURNING *', [json])
        .then(item => {
          spark.write({id: req.id, statement: 'insert', value: item})
          PubSub.publish()
        })
    } else if (typeof(req.subscribe) !== 'undefined') {
      PubSub.subscribe(req.subscribe, spark, req.id)
    }
  })
  spark.on('end', () => {
    console.log(spark.id, ': client disconnected.')
    PubSub.unsubscribe(spark)
  })
}, {port:8080, transformer: 'websockets'})
primus.save(__dirname + '/primus-client.js')
