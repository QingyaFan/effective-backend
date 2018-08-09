const Koa = require("koa")
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const fs = require("fs");

app.use(router.routes(), router.allowedMethods());

router.get('/async', async (ctx, next) => {
    let i = ctx.query.idx;
    fs.appendFile('test.txt', `${i.toString()} `, () => { })
})

router.get('/sync', (ctx, next) => {
    let i = ctx.params.idx;
    fs.appendFile('test.txt', `${i.toString()} `, () => { })
})

app.listen(8000, () => {
    console.log(`app started on 8000`)
})