const puppeteer = require('puppeteer');
var { timeout } = require('../tools/tools.js');
var key = require('./config.js').key

console.log(key)

puppeteer.launch({ headless: false }).then(async (browser) => {
  var so = async () => {
    var page = await browser.newPage();
    await page.goto('https://www.so.com');
    await timeout(1500);
    await page.type(key, { delay: 100 })
    var submit = await page.$('#search-button')
    await submit.click()

    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.res-list')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })

    data.forEach(element => {
      console.log(element.content)
    });
  }

  var baidu = async () => {
    var page = await browser.newPage();
    await page.goto('https://www.baidu.com');
    await timeout(1500);
    await page.type(key, { delay: 100 })
    var submit = await page.$('#su')
    await submit.click()

    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.c-container')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })

    data.forEach(element => {
      console.log(element.content)
    });
  }

  var bing = async () => {
    var page = await browser.newPage();
    await page.goto('https://cn.bing.com/');
    await timeout(1500);
    await page.type(key, { delay: 100 })
    var submit = await page.$('#sb_form_go')
    await submit.click()

    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.b_algo')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })

    data.forEach(element => {
      console.log(element.content)
    });
  }

  var sogou = async () => {
    var page = await browser.newPage();
    await page.goto('https://www.sogou.com/');
    await timeout(1500);
    await page.type(key, { delay: 100 })
    var submit = await page.$('#stb')
    await submit.click()

    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.vrwrap')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText}
      })
    })

    data.forEach(element => {
      console.log(element.content)
    });
  }


  so()
  baidu()
  bing()
  sogou()
});
