var req = require('request-promise');
var fs = require('fs')

var options = {
    method: 'POST',
    uri: 'https://pic.xiaojianjian.net/webtools/picbed/uploadByUrl.htm',
    form: {
        url: 'https://image6.pengfu.com/origin/180707/5b407fdd5aeae.jpg'
    },
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' // Is set automatically
    }
};

req(options)
    .then(function (body) {
        body = JSON.parse(body)
        console.log(body)
        console.log('body:', body['original_pic'])
    })
    .catch(function (err) {
        console.log('err:', err)
    });
