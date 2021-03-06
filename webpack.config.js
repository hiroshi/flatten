module.exports = {
  entry: './web.js',
  output: './bundle.js',
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  devtool: 'sourcemap'
}
