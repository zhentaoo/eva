const puppeteer = require('puppeteer');
var { timeout } = require('./tools/tools.js');
var key = require('./config.js').key
var company = require('./config.js').company

// puppeteer.launch().then(async (browser) => {
puppeteer.launch({ headless: false }).then(async (browser) => {
  console.log('startTime:', new Date().toUTCString());
  try {
    /**
     * 搜索引擎
     */
    // await require('./data-source/so.js')(browser, timeout, key)
    // await require('./data-source/sogou.js')(browser, timeout, key)
    // await require('./data-source/baidu.js')(browser, timeout, key)
    // await require('./data-source/bing.js')(browser, timeout, key)

    /**
     * 段子
     */
    // await require('./duanzi/pengfu.js')(browser, timeout, company)
    // await require('./duanzi/qiubai-detail.js')(browser, timeout, company)
    await require('./duanzi/budejie-detail.js')(browser, timeout, company)

    /**
     * 企业信息
     */
    // await require('./data-source/tianyancha.js')(browser, timeout, company)
  } catch (error) {
    console.log(error)
    console.log('endTime:', new Date().toUTCString());
  }
  console.log('endTime:', new Date().toUTCString());
});
