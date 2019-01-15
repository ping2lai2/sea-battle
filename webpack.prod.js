const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin('dist', {}),
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      terserOptions: {
        compress: true,
        ecma: 6,
        output: {
          comments: false,
          beautify: false,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
});
