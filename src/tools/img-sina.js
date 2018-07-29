var req = require('request-promise');
var fs = require('fs')

async function a () {
    let imgurl = 'https://image7.pengfu.com/origin/180727/5b5adaf912540.jpg'
    let type = imgurl.split('.').pop()

    let response = await req('https://api.yum6.cn/sinaimg.php?img=' + imgurl)
    response = JSON.parse(response)
    let cdn_img_url = 'https://ww2.sinaimg.cn/large/' + response.pid + '.' + type

    console.log(response)
    console.log(cdn_img_url)
    // item.cdn_img_url = 'https://ww2.sinaimg.cn/large/' + response.pid
}

a()