// webpack v4
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const merge = require('webpack-merge');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// TODO: add webpack-merge and production mode
/*
const PATHS = {
  app: path.join(__dirname, 'client'),

  build: path.join(__dirname, 'dist'),
};
*/

module.exports = {
  entry: { main: './client/index.js' }, // TODO: add current file structure and change path
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    port: 3000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg)$/, //TODO: dont forget delete
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000, // Convert images < 8kb to base64 strings
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    //new CleanWebpackPlugin('dist', {}),
    new MiniCssExtractPlugin({ filename: 'style.css' }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: false,
      template: './client/index.html',
      filename: 'index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};

/*
module.exports = (env, { mode }) => {
  if (mode == 'production') {
    return merge(commonConfig, prodConfig);
  }

  return commonConfig;
};
*/
