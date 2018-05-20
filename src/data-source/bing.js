var fs = require("fs");

const source = 'bing'
const url = 'https://cn.bing.com/'
const submitSelectName = '#sb_form_go'
const domSelectName = '.b_algo'
const nextPageSelectName = '.sw_next'
const needPageMaxNum = 20

module.exports = async (browser, timeout, key) => {
    console.log(url)

    // 从dom获取数据，并写文件
    var getDataFromDom = async () => {
      console.log(getDataFromDom)

      // await timeout(3000* Math.random());
      var data = await page.evaluate(() => {
        var list = [...document.querySelectorAll('.b_algo')]
        return list.map(el => {
          return { html: el.innerHTML, content: el.innerText }
        })
      })
      
      var content = []
      data.forEach(element => {
        content.push(element.content)
      });
  
      await fs.appendFileSync(`./src/data/${source}-${key}.txt`, `startTime: ${new Date().toUTCString()}`+'\r');
      await fs.appendFileSync(`./src/data/${source}-${key}.txt`, JSON.stringify(content, null , ' ')+'\r');
      await fs.appendFileSync(`./src/data/${source}-${key}.txt`, `endTime: ${new Date().toUTCString()}`+'\r\r');
    }

  // 1.跳转至相应的页面
  var page = await browser.newPage();
  await page.goto(url);

  // 2.输入关键字
  await timeout(3000* Math.random());
  await page.type(key, { delay: 100 })

  // 3.点击提交
  var submit = await page.$(submitSelectName)
  await timeout(1000)
  await submit.click()

  // 4.获取数据，数据写文件
  await getDataFromDom()

  // 6.翻页，数据写文件
  var nextPage = await page.$(nextPageSelectName)
  for (let index = 0; index < needPageMaxNum; index++) {
    var nextPage = await page.$(nextPageSelectName)
    
    await nextPage.click()
    await timeout(3000* Math.random());
    await getDataFromDom()
  }

  // 7.关闭页面
  await timeout(3000* Math.random());
  await page.close()
}