var fs = require("fs");

module.exports = async (
  browser, timeout, key,
  source, url, submitSelectName, domSelectName,
  nextPageSelectName, needPageMaxNum
) => {
  // 从dom获取数据，并写文件
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate((domSelectName) => {
      var list = [...document.querySelectorAll(domSelectName)]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    }, domSelectName)

    var content = []
    data.forEach(element => {
      content.push(element.content)
      console.log(content)
    });

    await fs.appendFileSync(`./src/data/${key}-${source}.txt`, `startTime: ${new Date().toUTCString()}`+'\r');
    await fs.appendFileSync(`./src/data/${key}-${source}.txt`, JSON.stringify(content, null , ' ')+'\r');
    await fs.appendFileSync(`./src/data/${key}-${source}.txt`, `endTime: ${new Date().toUTCString()}`+'\r\r');
  }

  // 1.跳转至相应的页面
  var page = await browser.newPage();
  await page.goto(url);
  
  // 2.输入关键字
  await timeout(3000* Math.random());
  await page.type(key, { delay: 100 })
  
  // 3.点击提交
  var submit = await page.$(submitSelectName)
  await submit.click()

  // 4.获取数据，数据写文件
  await getDataFromDom()
  
  // 6.翻页，数据写文件
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