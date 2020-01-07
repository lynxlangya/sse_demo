/**
 * @author MARS <wangyunfan@vtstar.net>
 * @date 2019-11-29
 * @fileoverview sse 服务端
 */
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const PassThrough = require('stream').PassThrough;

app.use(serve(__dirname + '/src/'))

app.use(async (ctx) => {
    const {
        res
    } = ctx;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        "Access-Control-Allow-Origin": '*',
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })

    let stream = new PassThrough();
    let i = 0;
    let timer = setInterval(() => {
        stream.write(`id: ${i}\n`)
        stream.write(`data: 这是第 ${i} 条消息\n`)
        stream.write(`retry: 10000\n`)
        stream.write('\n\n\n\n')
        i++
    }, 1000);

    stream.on('close', function () {
        console.log('closed')
        clearInterval(timer)
    })

    stream.write(`id: ${i}\n`)
    stream.write(`data: 这是第 ${i} 条消息\n`)
    stream.write(`retry: 10000\n`)
    stream.write('\n\n\n\n')

    ctx.body = stream;
})

app.listen(9999)




/**
 * @method node第二种实现方式
 * @description 阮一峰教程
 */
// var http = require("http");

// http.createServer(function (req, res) {
//     var fileName = "." + req.url;

//     if (fileName === "./stream") {
//         res.writeHead(200, {
//             "Content-Type": "text/event-stream",
//             "Cache-Control": "no-cache",
//             "Connection": "keep-alive",
//             "Access-Control-Allow-Origin": '*',
//         });
//         res.write("retry: 10000\n");
//         res.write("event: connecttime\n");
//         res.write("data: " + (new Date()) + "\n\n");
//         res.write("data: " + (new Date()) + "\n\n");

//         interval = setInterval(function () {
//             res.write("data: " + (new Date()) + "\n\n");
//         }, 1000);

//         req.connection.addListener("close", function () {
//             clearInterval(interval);
//         }, false);
//     }
// }).listen(9999, "127.0.0.1");