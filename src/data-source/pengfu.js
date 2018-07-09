var fs = require("fs");
var req = require('request-promise');
var url = 'https://www.pengfu.com/'
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
      var list = [...document.querySelectorAll('.list-item')]

      return list.map(el => {
        return {
          title: el.querySelector('.dp-b').innerText,
          content: el.querySelector('.content-img').innerText,
          imgurl: el.querySelector('.content-img > img') && el.querySelector('.content-img > img').src,
          cdn_img_url: null,
          zan: el.querySelector('.fl .ding').innerText,
          comments: el.querySelector('.fl .commentClick').innerText,
          type: el.querySelectorAll('div.fr > a')
            && ([...el.querySelectorAll('div.fr > a')].map(i => { return i.innerText }).join(','))
        }
      })
    })

    // 上传图片到图床
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.imgurl) {
        var options = {
          method: 'POST',
          uri: 'https://pic.xiaojianjian.net/webtools/picbed/uploadByUrl.htm',
          form: {
            url: element.imgurl
          }
        };

        try {
          let response = await req(options)
          response = JSON.parse(response)
          data[index].cdn_img_url = response.original_pic
        } catch (error) {
          console.log(error)
        }

      }
    }
    console.log('data:', JSON.stringify(data))

    // 上传到qqeasy数据库
    var options = {
      method: 'POST',
      uri: 'http://juhe.qqeasy.com/information/import-jokes',
      body: {
        "key": keyCode,
        "from": '捧腹网',
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
    } catch (error) {}

    await fs.appendFileSync(`./src/data/pengfu.txt`, JSON.stringify(data, null, ' ') + '\r');
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