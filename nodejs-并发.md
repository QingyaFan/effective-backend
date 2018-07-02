# Nodejs并发

Nodejs使用的是`event loop`模型，结合异步I/O，可以在有限的硬件资源上实现高并发。但它也有一个经常被提起的问题：在密集计算的时候捉襟见肘。这篇文章里，我们看一下这些说法具体是怎么回事。

## 高并发

nodejs使用单进程，但其`event loop`模型保证了可以在单进程中准实时地接收非常多的请求，请求往往附带计算和I/O的需求，如果是I/O的需求，也就是nodejs擅长的I/O密集型应用，nodejs的IO的实现是异步的，因此可以在IO操作完成之前去干别的事情，因此，从表面看来，在同一时间，nodejs可以处理更多的请求，但还是依赖高效的后端IO，请求不一定能很快完成并返回结果。

如果请求的需求时计算，也就是计算密集型应用，那么nodejs的单进程模型就捉襟见肘了，可想而知的会阻塞，第二个请求只能等到第一个请求完成才能开始处理。

## 高并发，密集IO示例

高并发，密集IO。我们先看一个例子，来比较一下同步IO和异步IO的差异：

```lang=js
const fs = require('fs')
const util = require('util')
const appendFile = util.promisify(fs.appendFile)

async function testSyncIO() {
    await appendFile('test.txt', '\n')
    for(let i = 0; i < 10000; i++) {
        await appendFile('test.txt', `${i.toString()} `)
    }
}

function testAsyncIO() {
    fs.appendFile('test.txt', '\n', () => {})
    for (let i = 0; i < 10000; i++) {
        fs.appendFile('test.txt', `${i.toString()} `, () => {})
    }
}

testSyncIO()
// testAsyncIO()
```

执行结果耗时：

> （同步IO）0.99s user 1.45s system 102% cpu 2.394 total
> （异步IO）0.45s user 0.50s system 151% cpu 0.624 total

将循环次数由10000改为100000，执行结果耗时：

> （同步IO）8.11s user 14.88s system 100% cpu 22.866 total
> （异步IO）1.98s user 1.70s system 140% cpu 2.612 total

当然为了避免偶然性的误差，我重复试验了几次，结果都差不多，异步IO确实显著提高了性能。当然我们也可以看出，异步IO占用了更多的系统资源，则是因为同步的IO排队了，顺序执行，肯定没有发挥出nodejs的异步IO优势；而异步IO所有请求则是一拥而上，这时就可以完全发挥nodejs的异步IO优势。

## 高并发，密集计算

nodejs基于V8，V8针对于浏览器开发的，也是单线程运行JavaScript，而计算都是运行在主线程的，所以长时间的计算会阻塞主线程处理新的请求。目前有两个方法可以缓解这个问题：使用`child_process`或`cluster`。

使用`child_process`会启动新的进程来处理主线程处理不完的请求，但是进程相对于线程而言会消耗更多的系统资源，且进程间通信也不方便，且很容易出错。

使用Cluster模块，可以同时启动多个nodejs线程，可以在一定程度上改善密集计算的问题，但是线程数量肯定也是有限的，且不能随着请求的数量自动调整线程数量，请求少的时候，过多的nodejs线程对系统资源是一种浪费，而请求多时，较少的nodejs线程可能撑不住。

最新的nodejs 10.5多了一个目前处于试验阶段的模块`worker_threads`，相对于Cluster，线程数量是动态的，可以随着请求的数量动态调整。看起来还是不错的，在别的文章里再讲它。