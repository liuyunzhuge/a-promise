# a-promise
非常简单的promise实现，核心源码100多行，清晰易懂，适合学习；不需要在生产环境中使用，Promise都已经是规范了，哪还需要自己去写；实现思路参考自then/promise。

## 说明
这是一个学习和总结性的项目。实现思路基本上跟[then/promise](https://github.com/then/)是一致的，不过在它的基础之上，我按照自己的编程风格、命名习惯、组织方式做了调整，以便对Promise实现感兴趣的人，可以从我的这份代码里，花更少的时间来加强自己对Promise的理解。

当初在看到`then/promise`的源码时，我并没有能够很快速地就能了解它的实现的各个细节，即使在它的代码也非常简短的情况下；经过一段时间琢磨，我发现`then/promise`的作者比较注重代码的简洁性，而弱化了代码的语义和可阅读性，所以我打算按照自己对它的理解，重新写一下，一来加强自己对Promise的认知，二来也可以记录在此，让更多人有机会学习到这个很有价值的实现方式。想想看，假如在求职的过程中，面试官要求你手写Promise的实现方式，那这个项目所分享的思路，正好帮你做这种特殊场景的准备。

Promise应该被看做一种编程思想，它的使用范围远不止于javascript环境，其它语言环境，比如android，object-c，swift也都可以使用这个模式来做异步任务。当你有机会做前端之外的语言时，可以去试试自己在前端所学到的Promise。

## 源码
核心源码只有两个文件：
* src/core.js
* src/static.js

`src/core.js`提供了以下实现：
* Promise构造函数
* Promise.prototype.then这个原型方法
* Promise.prototype.catch这个原型方法
* Promise.prototype.finally这个原型方法

`scr/static.js`提供了以下实现：
* Promise.resolve这个静态方法
* Promise.reject这个静态方法
* Promise.all这个静态方法
* Promise.race这个静态方法

**注意**
`core.js`里面`handleDeferred`这个方法提到应该把`setTimeout`替换为`asap`的方式，我的代码里没有替换，因为毕竟只是个学习的项目；之所以要替换的原因，是按照Promise规范，Promise实例添加的回调函数应该是在要本次事件循环(`event-loop`)的末尾、下次事件循环前执行的，`asap`这个库（当然还有别的库）可以帮你做到这一点，而`setTimeout`开启的定时器会在下一次事件循环开始时才会执行。

`core.js`里面`finishPromise`方法加了一个`console.error`的打印处理，这个只有在一个Promise实例没有添加任何回调，而且状态为`rejected`时才会执行，防止因为Promise吞并错误，导致使用Promise的人看不到`rejected`的相关原因。

## 测试
```bash
npm install

node server
```
打开[http://localhost:8080/examples/01.html](http://localhost:8080/examples/01.html)。这些demo都算是测试用例，需要在控制台里面查看运行结果。

`examples/`里面写的测试用例，都是在开发过程中用的，不是专门用来做这个项目的覆盖测试的。这个项目的目的是学习，假如你对Promise特性非常熟悉的情况下，可以根据自己的想法，写用例来测试这个项目提供的Promise实现。
