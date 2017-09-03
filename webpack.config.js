var webpack = require('webpack');
var path = require('path');
var libraryName = 'smartflow';
var outputFile = libraryName + '.js';

var config = {
  entry: __dirname + '/src/smartflow.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName
  }
};

module.exports = config;
