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
    for (let i = 0 ; i < data.length; i++) {
      let item = data[i]
      if (!item.imgurl) {
        continue
      }
      console.log('上传图片')

      try {
        let imgurl = item.imgurl
        let type = imgurl.split('.').pop()
    
        let response = await req('https://api.yum6.cn/sinaimg.php?img=' + imgurl)
        response = JSON.parse(response)
        let cdn_img_url = 'https://ww2.sinaimg.cn/large/' + response.pid + '.' + type
        item.cdn_img_url = cdn_img_url
        console.log(JSON.stringify(item))
      } catch (error) {
        console.log(i, error)
      }
    }

    console.log('data:', JSON.stringify(data))

    // 写文件
    try {
      await fs.appendFileSync(`./src/data/pengfu.txt`, JSON.stringify(data, null, ' ') + '\r');
    } catch (error) {
      console.log('err:', error)
    }

    var options = {
      method: 'POST',
      timeout: 3000000,
      uri: 'https://juhe.qqeasy.com/information/import-jokes',
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
      console.log('res:', response)
    } catch (error) {
      console.log('err:', error)
    }
  }

  var page = await browser.newPage();
  await page.goto(url);
  // await timeout(500);
  console.log('aaa')
  // await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.page > div > a:last-child')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}