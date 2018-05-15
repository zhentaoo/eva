const puppeteer = require('puppeteer');
var { timeout } = require('../tools/tools.js');
var key = require('./config.js').key
var company = require('./config.js').company

console.log(key, company)
puppeteer.launch({ headless: false }).then(async (browser) => {
  var date = new Date()
  var startTime = date.toUTCString() ;
  console.log('startTime:', startTime);
  
  var endTime = null;
  try {
    /**
     * 搜索引擎
     */
    
    // require('./data-source/so.js')(browser, timeout, key)
    // require('./data-source/sogou.js')(browser, timeout, key)
    // require('./data-source/baidu.js')(browser, timeout, key)
    // require('./data-source/baidu.js')(browser, timeout, key)

    /**
     * 其他
     */
    await require('./data-source/tianyancha.js')(browser, timeout, company)
  } catch (error) {
    endTime = new Date().toUTCString();
    console.log('endTime:', endTime);
  }
  endTime = new Date().toUTCString();
  console.log('endTime:', endTime);
});
