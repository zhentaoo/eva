var fs = require("fs");
var req = require('request-promise');
var url = 'https://www.pengfu.com/'

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.list-item')]

      return list.map(el => {
        return { 
          title: el.querySelector('.dp-b').innerText,
          content: el.querySelector('.content-img').innerText,
          img: el.querySelector('.content-img > img') && el.querySelector('.content-img > img').src,
          zan: el.querySelector('.fl .ding').innerText,
          cai: el.querySelector('.fl .cai').innerText,
          comment: el.querySelector('.fl .commentClick').innerText,
          type: el.querySelectorAll('div.fr > a') 
            && ([...el.querySelectorAll('div.fr > a')].map(i => {return i.innerText}).join(','))
        }
      })
    })
    console.log(data)

    var options = {
      method: 'POST',
      uri: 'http://juhe.qqeasy.com/information/import-jokes',
      body: {
        "key": "eb7ca6b347b0572",
        "from": url,
        "from_url": url,
        "create_time": new Date().toUTCString(),
        "data": {
         "contents": data
        }
      },
      json: true // Automatically stringifies the body to JSON
    }
    
    let response = await req(options)
    console.log(response)

    // await fs.appendFileSync(`./src/data/pengfu.txt`, `startTime: ${new Date().toUTCString()}`+'\r');
    await fs.appendFileSync(`./src/data/pengfu.txt`, JSON.stringify(data, null , ' ')+'\r');
    // await fs.appendFileSync(`./src/data/pengfu.txt`, `endTime: ${new Date().toUTCString()}`+'\r\r');
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