var fs = require("fs");
var req = require('request-promise');
var url = 'https://www.pengfu.com/'
var origin_key = 'b61d91ea6c3'
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1');
var moment = require('moment')

var fn = async function (params) {
    var str = moment().format('YYYY-MM-DD 00:00:00') + origin_key
    console.log('str:', str)
    sha1.update(str)
    var keyCode = sha1.digest('hex')
    console.log('keyCode:', keyCode)
    keyCode = keyCode.substr(-15)
    console.log('keyCode15:', keyCode)

    var res = await req({
        method: 'POST',
        uri: 'http://juhe.qqeasy.com/information/import-jokes',
        body: {
            "key": keyCode,
            "from": url,
            "from_url": url,
            "create_time": new Date().toUTCString(),
            "data": {
                "contents": [
                    {
                        "title": "三地鼠使用了惊吓，你的防御下降了",
                        "content": "",
                        "img": "https://image7.pengfu.com/origin/180601/5b11467493589.gif"
                    },
                    {
                        "title": "幸福送给别人，悲伤留给自己",
                        "content": "女同学结婚，邀请我做伴娘。我深感荣幸，婚宴上喝得不亦乐乎。另一位女同学趁着酒意告诉我:新娘A杯，怕婚礼上被抢风头，为选伴娘伤透脑筋。终于大家一致推荐了你，因为没有最小只有更小！",
                        "img": null
                    }
                ]
            }
        },
        json: true // Aut
    })

    console.log(res)
}

fn()