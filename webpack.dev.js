const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'client/'),
    watchContentBase: true,
    historyApiFallback: true,
    disableHostCheck: true,  
    port: 3000,
    open: true,
  },
  plugins: [],
});
