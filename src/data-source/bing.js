var fs = require("fs");

const source = 'bing'
const url = 'https://cn.bing.com/'
const submitSelectName = '#sb_form_go'
const domSelectName = '.b_algo'
const nextPageSelectName = '[title="下一页"]'
const needPageMaxNum = 20

module.exports = async(browser, timeout, key) => {
  require('./template/search-engine.js')(
    browser, timeout, key,
    source, url, submitSelectName, domSelectName,
    nextPageSelectName, needPageMaxNum
  )
}