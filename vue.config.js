const getPages = require('./src/utils/getPages.js');
const path = require('path');
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir);
}
let pages = getPages.pages();
module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@page': resolve('src/pages')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        dayjs: 'dayjs'
      })
    ]
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap(args => {
        args[0].title = '专科视图';
        return args;
      });
    }
  },
  // filenameHashing: false,
  // pages,
  outputDir: 'dist/EMRZKST',
  publicPath: process.env.NODE_ENV === 'production' ? '/EMR/EMRZKST/' : '/'
};
