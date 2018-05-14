const puppeteer = require('puppeteer');
var { timeout } = require('../tools/tools.js');
var key = require('./config.js').key

console.log(key)

puppeteer.launch({ headless: false }).then(async (browser) => {
  require('./data-source/so.js')(browser, timeout, key)
  require('./data-source/sogou.js')(browser, timeout, key)
  require('./data-source/baidu.js')(browser, timeout, key)
  require('./data-source/bing.js')(browser, timeout, key)
});
