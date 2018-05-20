var fs = require("fs");

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.c-container')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })

    var content = []
    data.forEach(element => {
      content.push(element.content)
      console.log(content)
    });

    await fs.appendFileSync(`./src/data/baidu-${key}.txt`, `startTime: ${new Date().toUTCString()}`+'\r');
    await fs.appendFileSync(`./src/data/baidu-${key}.txt`, JSON.stringify(content, null , ' ')+'\r');
    await fs.appendFileSync(`./src/data/baidu-${key}.txt`, `endTime: ${new Date().toUTCString()}`+'\r\r');
  }

  var page = await browser.newPage();
  await page.goto('https://www.baidu.com');
  await timeout(1500);
  await page.type(key, { delay: 100 })
  var submit = await page.$('#su')
  await submit.click()
  await getDataFromDom()
  
  var nextPage = await page.$('#page > a.n')  
  for (let index = 0; index < 2; index++) {
    if(index > 0) {
      var nextPage = await page.$('#page > a.n:last-child')  
    }
    
    await nextPage.click()
    await timeout(3000* Math.random());
    await getDataFromDom()
  }

  await page.close()
}