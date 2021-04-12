var path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',//your ip address
    port: 8000,
    disableHostCheck: true,
  },
};