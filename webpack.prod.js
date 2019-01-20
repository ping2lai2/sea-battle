const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin('dist', {}),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        ecma: 8,
        warnings: false,
        mangle: true,
      },
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
});
