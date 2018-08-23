# 使用Nodejs上传文件时应注意的事情

## 上传json

需要设置`Content-Type`为`octet-stream`，否则会解析其内容。

```nodejs
"use strict";

const request = require("request");
const fs = require("fs");

const options = {
    url: `http://localhost:8080/upload`,
    formData: {
        file: {
            value: fs.createReadStream('./test.json'),
            options: {
                filename: 'test.json',
                contentType: 'application/octet-stream'
            }
        },
        encoding: 'utf-8',
    },

};

request.post(options, (err, res, body) => {
    if (err) {
        console.log("请求失败");
        return;
    }
    console.log(`请求成功`)
    console.log(body)
});
```