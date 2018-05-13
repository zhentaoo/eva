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

    var weibo = async () => {
      var page = await browser.newPage();

      await page.goto('https://weibo.com/')
      await timeout(8000);

      var input = await page.$('#weibo_top_public > div > div > div.gn_search_v2 > input')
      input.click()
      await page.type(key, {delay: 100})
      await timeout(2000);
      
      var submit = await page.$('#weibo_top_public > div > div > div.gn_search_v2 > a')
      await submit.click()
    }

  var jianshu = async () => {
    var page = await browser.newPage();

    await page.goto('https://www.jianshu.com')
    await timeout(2000);

    var input = await page.$('#q')
    input.click()

    await page.type(key, { delay: 1000 })
    await timeout(2000);

    var submit = await page.$('#menu > ul > li.search > form > a')
    await submit.click()
  }

  jianshu()
  baidu()
  so()
  weibo()
});
