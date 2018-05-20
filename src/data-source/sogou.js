var fs = require("fs");

// 搜索源
const source = 'sogou'

// 路径
const url = 'https://www.sogou.com/'

// 搜索按钮,选择器
const submitSelectName = '#stb'

// 页面内容,选择器
const domSelectName = '.vrwrap'

// 下一页,选择器
const nextPageSelectName = '#sogou_next'

// 翻页数量
const needPageMaxNum = 20

module.exports = async(browser, timeout, key) => {
  require('./template/search-engine.js')(
    browser, timeout, key,
    source, url, submitSelectName, domSelectName,
    nextPageSelectName, needPageMaxNum
  )
}
