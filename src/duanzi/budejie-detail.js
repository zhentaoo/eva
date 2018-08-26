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

var url = 'http://www.budejie.com/detail-28376314.html'
var fromName = '不得姐'
var fromFileName = 'budejie'

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);

    var data = await page.evaluate(() => {
      let discuss = []
      document.querySelectorAll('#hotCommentList').forEach(el => {
        if (el.querySelector('.g-mnc1') && el.querySelector('.g-mnc1').innerText) {
          let txt = el.querySelector('.g-mnc1').innerText
          discuss.push(txt.trim())
        }
      })

      return {
        title: null,
        content: document.querySelector('.j-r-list-c-desc') ? document.querySelector('.j-r-list-c-desc').innerText : null,
        discuss: JSON.stringify(discuss),
        imgurl: document.querySelector('.j-r-list-c-img > img') ? document.querySelector('.j-r-list-c-img > img').src : null,
        cdn_img_url: null,
        zan: document.querySelector('.j-r-list-tool-l-up').innerText.trim(),
        comments: document.querySelector('.comment-counts').innerText.trim(),
        type: null
      }
    })

    data = [data]
    // 上传图片
    // data = await common.uploadImg(data)

    // 写文件
    await common.wirteFile(data, fromFileName)

    // 上传到后台
    await common.uploadData(fromName, data, url)
  }

  var page = await browser.newPage();
  await page.goto(url);
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.c-next-btn')
    
    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}