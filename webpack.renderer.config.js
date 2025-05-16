// const rules = require('./webpack.rules');

// rules.push({
//   test: /\.css$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
// });

// module.exports = {
//   // Put your normal webpack config below here
//   module: {
//     rules,
//   },
// };

const rules = require('./webpack.rules');
const path = require('path');

// Add CSS handling rule
rules.push({
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.png', '.jpg', '.gif', '.svg'],
  },
};