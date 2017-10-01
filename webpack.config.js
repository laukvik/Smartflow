var path = require('path');

module.exports = {
  entry: './src/smartflow.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'smartflow.js',
    library: 'Smartflow',
    libraryTarget: 'var'
  }
};
