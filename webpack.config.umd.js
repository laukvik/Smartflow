const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'source-map',
  entry: {
    'Smartflow': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname,"./dist/umd"),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'smartflow'
  },
  externals: {

  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: true,
      comments: true,
      mangle: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src')
      }
    ]
  }
}
