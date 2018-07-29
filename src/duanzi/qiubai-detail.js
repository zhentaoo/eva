var fs = require("fs");
var req = require('request-promise');
var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')
var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
sha1.update(str)
var keyCode = sha1.digest('hex')
keyCode = keyCode.substr(-15)
var common = require('./common.js')

var url = 'https://www.qiushibaike.com/article/120754772'
var fromName = '糗百'
var fromFileName = 'qiubai-detail'

module.exports = async (browser, timeout, key) => {
  // 从DOM爬取数据
  var getDataFromDom = async () => {
    await timeout(1500);
    
    var data = await page.evaluate(() => {
      var discuss = []
      document.querySelectorAll('.comments-table .main-text').forEach(el => {
        discuss.push(el.innerText)
      })

      return {
        title: null,
        content: document.querySelector('.content') ? document.querySelector('.content').innerText : null,
        discuss: JSON.stringify(discuss),
        imgurl: document.querySelector('.thumb img') ? document.querySelector('.thumb img').src : null,
        cdn_img_url: null,
        zan: document.querySelector('.stats-vote .number').innerText,
        comments: document.querySelector('.stats-comments .number').innerText,
        type: null
      }
    })
    data = [data]
    
    console.log(data)
    // 上传图片
    data = await common.uploadImg(data)

    // 写文件
    await common.wirteFile(data, fromFileName)

    // 上传到后台
    await common.uploadData(fromName, data, url)
  }

  var page = await browser.newPage();
  await page.goto(url);
  await timeout(1000);
  console.log(99)
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.page-nav-list-next')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }
  await page.close()
}