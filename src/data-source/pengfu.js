var fs = require("fs");

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    console.log(data)

    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.list-item')]
      console.log(list)

      return list.map(el => {
        return { 
          title: el.querySelector('.dp-b').innerText,
          content: el.querySelector('.content-img').innerText,
          img: el.querySelector('.content-img > img') && el.querySelector('.content-img > img').src
        }
      })
    })

    console.log(data)

    var content = []
    data.forEach(element => {
      content.push(element)
      console.log(element)
    });

    // await fs.appendFileSync(`./src/data/pengfu.txt`, `startTime: ${new Date().toUTCString()}`+'\r');
    await fs.appendFileSync(`./src/data/pengfu.txt`, JSON.stringify(content, null , ' ')+'\r');
    // await fs.appendFileSync(`./src/data/pengfu.txt`, `endTime: ${new Date().toUTCString()}`+'\r\r');
  }

  var page = await browser.newPage();
  await page.goto(`https://www.pengfu.com/`);
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