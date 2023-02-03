/*
 * @Description: 获取多页面主要JS文件
 * @Autor: LSX
 * @Date: 2021-08-23 09:56
 * @LastEditTime: 2021-09-14 15:52
 */

const glob = require('glob');
let pages = {};
module.exports.pages = function() {
  glob.sync('./pages/*/*.js').forEach(filepath => {
    let fileList = filepath.split('/');
    let fileName = fileList[fileList.length - 2];
    pages[fileName] = {
      entry: `src/pages/${fileName}/${fileName}.js`,
      // 模板来源
      template: `src/pages/${fileName}/${fileName}.html`,
      // 在 dist/index.html 的输出
      filename: process.env.NODE_ENV === 'development' ? `${fileName}.html` : `${fileName}/${fileName}.html`
      // 提取出来的通用 chunk 和 vendor chunk
      // chunks: ['chunk-vendors', 'chunk-common', fileName]
    };
  });
  return pages;
};
