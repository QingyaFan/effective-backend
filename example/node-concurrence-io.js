const fs = require('fs')
const util = require('util')
const appendFile = util.promisify(fs.appendFile)

for(let i = 0; i < 100; i++) {
    appendFile('test.txt', i.toString())
}