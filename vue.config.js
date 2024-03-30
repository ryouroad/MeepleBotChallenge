const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/MeepleBotChallenge/'
    : '/',
  configureWebpack: {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
    ],
  },
  css: {
    extract: true,
  },    
}
