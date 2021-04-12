const path = require('path');
const webpack = require('webpack')
const Dotenv = require('dotenv-webpack');

module.exports = {
  //...
  plugins: [
    new Dotenv({
      path: process.env.MODE === 'dev' ? './.dev.env' : './.env',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|mp3|wav|ogg)$/,
        loader: 'file-loader',
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',//your ip address
    port: 8000,
    disableHostCheck: true,
  },
};