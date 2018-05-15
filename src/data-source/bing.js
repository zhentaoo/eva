module.exports = async (browser, timeout, key) => {
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