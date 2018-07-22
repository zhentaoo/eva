var fs = require("fs");
var req = require('request-promise');
// var url = 'https://www.qiushibaike.com/imgrank/'
// var url = 'https://www.qiushibaike.com/'
var url = 'https://www.qiushibaike.com/pic/'

var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')

var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
sha1.update(str)
var keyCode = sha1.digest('hex')
keyCode = keyCode.substr(-15)

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('#content-left .article')]

      return list.map(el => {
        return {
          title: null,
          content: el.querySelector('.contentHerf') ? el.querySelector('.contentHerf').innerText : null,
          imgurl: el.querySelector('.thumb img') ? el.querySelector('.thumb img').src : null,
          cdn_img_url: null,
          zan: el.querySelector('.stats-vote .number').innerText,
          comments: el.querySelector('.stats-comments .number').innerText,
          type: null
        }
      })
    })
    console.log('data:', JSON.stringify(data))
    
    // 写文件
    try {
      await fs.appendFileSync(`./src/data/qiubai.txt`, JSON.stringify(data, null, ' ') + '\r');
    } catch (error) {
      console.log('err:', error)
    }
    var options = {
      method: 'POST',
      timeout: 3000000,
      uri: 'https://juhe.qqeasy.com/information/import-jokes',
      body: {
        "key": keyCode,
        "from": '糗百',
        "from_url": url,
        "create_time": new Date().toUTCString(),
        "data": {
          "contents": data
        }
      },
      json: true
    }
    
    try {
      let response = await req(options)
      console.log('res:', response)
    } catch (error) {
      console.log('err:', error)
    }
  }

  var page = await browser.newPage();
  await page.goto(url);
  await timeout(500);
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.next')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}