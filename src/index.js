const puppeteer = require('puppeteer');
var {timeout} = require('../tools/tools.js');
var key = require('./config.js').key

console.log(key)

var info1 = 'https://www.baidu.com/'
var info2 = 'https://weibo.com/'
var info3 = 'https://www.jianshu.com/'
var info4 = 'https://www.so.com/?src=so.com'
var info5 = 'https://www.sogou.com/'

puppeteer.launch({headless: false}).then(async (browser) => {
    var so = async () => {
      var page = await browser.newPage();

      await page.goto('https://www.so.com');
      await timeout(1500);
  
      await page.type(key, {delay: 100})
  
      var submit = await page.$('#search-button')
      await submit.click()
    }

    var baidu = async () => {
      var page = await browser.newPage();

      await page.goto('https://www.baidu.com');
      await timeout(1500);
  
      await page.type(key, {delay: 100})
  
      var submit = await page.$('#su')
      await submit.click()
    }
    
    baidu()
    so()
});
