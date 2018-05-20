
### 为什么要做信息聚合工具？意义是什么？
- 在日常工作生活中，多数人遇到新知识、新事物，第一反应便是去百度、知乎、bing、各个社区论坛，搜集信息，然后消化学习~~~
- 那么作为Coder的我们，为什么要手动去多个平台搜集信息，能不能有什么工具帮我们去各个平台搜集信息，最好还是消化过的，然后把有用的信息给我们呢？
- OK，今天先讨论如何从各个平台搜集信息
- 嗯，如标题所示，这里采用的的技术方案是Puppeteer。至于为什么要用Puppeteer？原因有二：1. 使用Puppeteer模拟用户操作，而不是简单的接口调用去获取数据，极大降低被判定为爬虫的风险。2. Puppeteer可以抓取客户端渲染的站点内容，这是传统爬虫难以做到的！

### 其次对Puppeteer进行简介
- Puppeteer本质是一个node库，他提供了一组通过DevTools Protocol来操纵Headless Chrome的高级API
- 其他详细介绍：[请猛戳Puppeteer官方文档](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)

#### Puppeteer 核心功能
- 生成网页PDF、截图
- 从网站抓取内容
- 爬取SPA应用，并生成预渲染内容
- UI自动化操作：表单提交、UI测试、键盘输入等
- 创建一个最新的自动化测试环境（chrome），可以直接在此运行测试用例
- 捕获站点时间线，帮助分析网站性能问题

### 接下来开始实战，Repo在 [Github Eva](https://github.com/zhentaoo/eva)
1. 运行Puppeteer
```js
  puppeteer.launch().then(async browser => {
    ......
    // do what you want
    ......
  })
```

2. 开一个新的tab页，跳转至事先定义好的站点
```js
  let page = await browser.newPage();
  await page.goto('https://www.tianyancha.com/search?key=${key}');
```

3. 分析站点dom结构，抓取你想要的内容
```js
  let data = await page.evaluate(() => {
      let list = [...document.querySelectorAll('.search_result_single')]

      return list.map(el => {
        return { html: el.innerHTML, content: el.innerText }
      })
    })
```

4. 将内容写入文件(如果大家感兴趣可以做成数据库存取，这不是重点)
```js
  fs.appendFileSync(`./src/data/tianyancha-${key}.txt`, `startTime: ${new Date().toUTCString()}`+'\r');

  fs.appendFileSync(`./src/data/tianyancha-${key}.txt`, JSON.stringify(content, null , ' ')+'\r');
```

5. 5.翻页操作，获取下一页的内容
```js
  for (let index = 0; index < needPageMaxNum; index++) {
    var nextPage = await page.$('#web-content > div > div > div > div.col-9.search-2017-2.pr15.pl0 > div.b-c-white.clearfix.position-rel.mb30 > div > div.search_pager.human_pager.in-block > ul > li.pagination-next.ng-scope > a')

    await nextPage.click()
    await timeout(6 * 1000 * Math.random());
    await getDataFromDom()
  }
```

6. 数据获取完毕，关闭页面
```js
  await page.close()
```

7. 小细节，为了更加真实，在模拟用户操作的的过程中，使用随机时间作为间隔
```js
    await timeout(6 * 1000 * Math.random());
```

8. 最后说明，这里只做了最基础的数据爬取，后续可能会做出duckduckgo么？敬请期待

9. 完整代码在: https://github.com/zhentaoo/eva (Demo型项目，无敏感信息)

10. 项目运行
  - git clone https://github.com/zhentaoo/eva
  - npm install (puppeteer在win下100+M、mac下70+M，请耐心等候，如果安装不了，请使用cnpm)
  - npm start
