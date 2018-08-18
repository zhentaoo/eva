var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')
var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
sha1.update(str)
var keyCode = sha1.digest('hex')
keyCode = keyCode.substr(-15)
var fs = require("fs");
var req = require('request-promise');
var common = require('./common.js')

var url = 'http://www.gaoxiaogif.cn/gif-1298.html'
var fromName = '搞笑动图'
var fromFileName = 'gaoxiaogif'

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);

    var data = await page.evaluate(() => {
      let discuss = []
      document.querySelectorAll('.box-s li').forEach(el => {
        if(el.querySelector('.content') && el.querySelector('.content').innerText) {
          discuss.push(el.querySelector('.content').innerText.split('：')[1])
        }
      })

      return {
        title: null,
        content: document.querySelector('.showtxt') ? document.querySelector('.showtxt').innerText : null,
        discuss: JSON.stringify(discuss),
        imgurl: document.querySelector('.imgp img') ? document.querySelector('.imgp img').src : null,
        cdn_img_url: null,
        zan: document.querySelector('.up').innerText,
        comments: null,
        type: null
      }
    })

    data = [data]
    // 上传图片
    data = await common.uploadImg(data)

    // 写文件
    await common.wirteFile(data, fromFileName)

    // 上传到后台
    await common.uploadData(fromName, data, url)
  }

  var page = await browser.newPage();
  await page.goto(url);
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.fr a')
    
    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}