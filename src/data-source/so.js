var fs = require("fs");

// 搜索源
const source = 'so'

// 路径
const url = 'https://www.so.com'

// 搜索按钮,选择器
const submitSelectName = '#search-button'

// 页面内容,选择器
const domSelectName = '.res-list'

// 下一页,选择器
const nextPageSelectName = '#snext'

// 翻页数量
const needPageMaxNum = 20

module.exports = async(browser, timeout, key) => {
  require('./template/search-engine.js')(
    browser, timeout, key,
    source, url, submitSelectName, domSelectName,
    nextPageSelectName, needPageMaxNum
  )
}
