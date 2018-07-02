const fs = require('fs')
const util = require('util')
const appendFile = util.promisify(fs.appendFile)

async function testSyncIO() {
    for(let i = 0; i < 100000; i++) {
        await appendFile('test.txt', `${i.toString()} `)
    }
}

function testAsyncIO() {
    for (let i = 0; i < 100000; i++) {
        fs.appendFile('test.txt', `${i.toString()} `, () => {})
    }
}

// testSyncIO()
testAsyncIO()