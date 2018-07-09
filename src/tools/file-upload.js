var req = require('request-promise');
var fs = require('fs')
var multiparty = require('multiparty');

async function downloadImg(url, fileUrl) {
    req(url)
        .pipe(fs.createWriteStream(fileUrl))
}

async function uploadImg(fileName, fileUrl, cdnUrl) {
    console.log(fileUrl)
    console.log(cdnUrl)

    var options = {
        method: 'POST',
        uri: cdnUrl,
        formData: {
            // Like <input type="text" name="name">
            name: 'smfile',
            // Like <input type="file" name="file">
            file: {
                value: fs.createReadStream(fileUrl),
                options: {
                    filename: fileName,
                    contentType: 'image/jpg'
                }
            },
            filename: fileName
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded' // Is set automatically
        }
    };

    req(options)
        .then(function (body) {
            console.log('body:', body)
            // POST succeeded...
        })
        .catch(function (err) {
            console.log('err:', err)
            // POST failed...
        });
}

async function uploadCdnImg(url) {
    var url = url
    var fileName = url.split('/').pop()
    var fileUrl = './src/img/' + fileName
    var cdnUrl = 'https://sm.ms/api/upload'

    await downloadImg(url, fileUrl)

    await uploadImg(fileName, fileUrl, cdnUrl)
}

uploadCdnImg('https://image7.pengfu.com/origin/180706/5b3f553ed9fb7.gif')