const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/MeepleBotChallenge/'
    : '/',
  configureWebpack: {
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',  // ユニークな名前を生成するように変更
        chunkFilename: 'css/[name].[contenthash:8].css',  // ユニークな名前を生成するように変更
      }),
    ],
  },
  css: {
    extract: true,
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js', // 修正
      swDest: 'service-worker.js' // 変更なし
    }
  }
}
