module.exports = async(browser, timeout, key) => {
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