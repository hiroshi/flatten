// import flat from './client.js'
const flat = require('./flat.js')
// const React = require('react')
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {items: []}
    flat.open()

    flat.subscribe({limit: 5}, (statement, item) => {
      // console.log(statement, item)
      this.setState({items: this.state.items.concat([item])})
    })
  }

  render () {
    return (
      <div>
        <h1>Hello, world!!</h1>
        <ul>
          {
            this.state.items.map(item => <li key={item.id}>{item.json.message}</li>)
          }
        </ul>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// flat.post({tags: ['foo', 'bar'], message: 'hello'}, item => {
//   console.log('item:', item)
// })
