var fs = require("fs");

module.exports = async (browser, timeout, key) => {
  var getDataFromDom = async () => {
    await timeout(1500);
    var data = await page.evaluate(() => {
      var list = [...document.querySelectorAll('.search_result_single')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })
    var content = []
    data.forEach(element => {
      content.push(element.content)
      console.log(content)
    });

    fs.appendFileSync('./src/data/tianyancha.txt', JSON.stringify(content)+'/n');
    // await appendFile('../data/tianyancha.txt', JSON.stringify(data)+'/n', (err)=>{console.log(err)})
  }

  var page = await browser.newPage();
  await page.goto(`https://www.tianyancha.com/search?key=${key}`);
  await timeout(500);
  await getDataFromDom()

  for (let index = 0; index < 3; index++) {
    var nextPage = await page.$('#web-content > div > div > div > div.col-9.search-2017-2.pr15.pl0 > div.b-c-white.clearfix.position-rel.mb30 > div > div.search_pager.human_pager.in-block > ul > li.pagination-next.ng-scope > a')

    await nextPage.click()
    await timeout(2000 * Math.random());
    await getDataFromDom()
  }
}