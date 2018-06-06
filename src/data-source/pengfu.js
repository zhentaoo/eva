var fs = require("fs");
var req = require('request-promise');
var url = 'https://www.pengfu.com/'
var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')

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
          zan: el.querySelector('.fl .ding').innerText,
          // cai: el.querySelector('.fl .cai').innerText,
          comments: el.querySelector('.fl .commentClick').innerText,
          type: el.querySelectorAll('div.fr > a') 
            && ([...el.querySelectorAll('div.fr > a')].map(i => {return i.innerText}).join(','))
        }
      })
    })
    console.log(data)
    
    try {
      var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
      sha1.update(str)
      var keyCode = sha1.digest('hex') 
      console.log('keyCode:', keyCode )
      keyCode = keyCode.substr(-15)
      console.log('keyCode15:', keyCode )      
    } catch (error) {
      
    }

    var options = {
      method: 'POST',
      uri: 'http://juhe.qqeasy.com/information/import-jokes',
      body: {
        "key": keyCode,
        "from": url,
        "from_url": url,
        "create_time": new Date().toUTCString(),
        "data": {
         "contents": data
        }
      },
      json: true // Automatically stringifies the body to JSON
    }

    try {
      let response = await req(options)
      console.log(response)
    } catch (error) {
      console.log(error)
    }

    await fs.appendFileSync(`./src/data/pengfu.txt`, JSON.stringify(data, null , ' ')+'\r');
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