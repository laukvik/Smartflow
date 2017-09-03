var concat = require('concat-files');

concat(
  [
    './src/smartflow.js',
    './src/builder.js',
    './src/components.js',
    './src/formatter.js',
  ], './dist/smartflow.js', function(err) {
  if (err) throw err
  console.log('done');
});
