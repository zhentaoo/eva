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

var url = 'http://www.budejie.com/detail-28358081.html'
var fromName = '不得姐'
var fromFileName = 'budejie'

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      let discuss = []
      document.querySelectorAll('#hotCommentList').forEach(el => {
        let txt = el.querySelector('.g-mnc1').innerText
        discuss.push(txt.trim())
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
    console.log('data:', JSON.stringify(data))

    // 上传图片
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (!item.imgurl) {
        continue
      }
      console.log('上传图片')

      try {
        let imgurl = item.imgurl
        let type = imgurl.split('.').pop()

        let response = await req({
          url: 'https://api.yum6.cn/sinaimg.php?img=' + imgurl
        })
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
      await fs.appendFileSync(`./src/data/${fromFileName}.txt`, JSON.stringify(data[0], null, ' ') + '\r');
    } catch (error) {
      console.log('err:', error)
    }

    // 上传到后台
    var options = {
      method: 'POST',
      timeout: 3000000,
      uri: 'https://juhe.qqeasy.com/information/import-jokes',
      body: {
        "key": keyCode,
        "from": fromName,
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
  await getDataFromDom()

  for (let index = 0; index < 10000000; index++) {
    var nextPage = await page.$('.page > div > a:last-child')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }

  await page.close()
}