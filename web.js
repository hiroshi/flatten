// import flat from './client.js'
const flat = require('./flat.js')
// const React = require('react')
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);


flat.open()

flat.subscribe(null, (statement, item) => {
  console.log(statement, item)
})

// flat.post({tags: ['foo', 'bar'], message: 'hello'}, item => {
//   console.log('item:', item)
// })
