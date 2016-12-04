// import flat from './client.js'
const flat = require('./flat.js')
// const React = require('react')
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {items: []}

    console.log('subscribe')
    flat.subscribe({limit: 5}, (statement, value) => {
      console.log('published')
      if (Array.isArray(value)) {
        this.setState({items: value})
      } else {
        this.setState({items: this.state.items.concat([value])})
      }
    })
  }

  _post = () => {
    flat.post({message: this.textarea.value}, () => {
      this.textarea.value = ""
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
        <textarea ref={ref => this.textarea = ref} />
        <button onClick={this._post}>Post</button>
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
