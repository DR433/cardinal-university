const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/main2.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  // Add any plugins here
};
