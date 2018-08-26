var fs = require("fs");
var req = require('request-promise');
var url = 'https://www.pengfu.com/qutu_18.html'

var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')

var url = 'https://www.pengfu.com/qutu_18.html'
var fromName = '捧腹'
var fromFileName = 'pengfu'

var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
sha1.update(str)
var keyCode = sha1.digest('hex')
keyCode = keyCode.substr(-15)

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.list-item')]

      return list.map(el => {
        return {
          title: el.querySelector('.dp-b').innerText,
          content: el.querySelector('.content-img').innerText,
          imgurl: el.querySelector('.content-img > img') ? (el.querySelector('.content-img > img').getAttribute('gifsrc') || el.querySelector('.content-img > img').src) : null,
          cdn_img_url: null,
          zan: el.querySelector('.fl .ding').innerText,
          comments: el.querySelector('.fl .commentClick').innerText,
          type: el.querySelectorAll('div.fr > a')
            && ([...el.querySelectorAll('div.fr > a')].map(i => { return i.innerText }).join(','))
        }
      })
    })
    console.log('data:', JSON.stringify(data))
    
    // 上传图片
    // data = await common.uploadImg(data)

    // 写文件
    await common.wirteFile(data, fromFileName)

    // 上传到后台
    await common.uploadData(fromName, data, url)
  }

  var page = await browser.newPage();
  await page.goto(url);
  await timeout(500);
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.page > div > a:last-child')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}