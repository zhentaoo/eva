var fs = require("fs");
var req = require('request-promise');
var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')
var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
sha1.update(str)
var keyCode = sha1.digest('hex')
keyCode = keyCode.substr(-15)

module.exports = {
    // 上传图片文件
    uploadImg: async (data) => {
        for (let i = 0; i < data.length; i++) {
            
            let item = data[i]
            if (!item.imgurl) {
                continue
            }
            try {
                console.log('上传图片')
                let imgurl = item.imgurl
                let type = imgurl.split('.').pop()

                let response = await req('https://api.yum6.cn/sinaimg.php?img=' + imgurl)
                console.log('response:', response)

                response = JSON.parse(response)
                let cdn_img_url = 'https://ww2.sinaimg.cn/large/' + response.pid + '.' + type
                item.cdn_img_url = cdn_img_url
            } catch (error) {
                console.log(i, error)
            }
        }
        return data
    },
    // 写文件
    wirteFile: async (data, fromFileName) => {
        try {
            console.log('写文件')
            await fs.appendFileSync(`./src/data/${fromFileName}.txt`, JSON.stringify(data[0], null, ' ') + '\r');
        } catch (error) {
            console.log('err:', error)
        }
    },
    // 上传到后台
    uploadData: async (fromName, data, url) => {
        var options = {
            method: 'POST',
            timeout: 3000000,
            uri: 'https://juhe.qqeasy.com/information/import-jokes',
            body: {
                "key": keyCode,
                "from": fromName,
                "from_url": url,
                "create_time": new Date().toUTCString(),
                "data": {
                    "contents": data
                }
            },
            json: true
        }

        try {
            console.log('上传到后台')
            let response = await req(options)
        } catch (error) {
            console.log('err:', error)
        }
    }
}