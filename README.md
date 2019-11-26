# a-promise
非常简单的promise实现，核心源码100多行，清晰易懂，适合学习；不需要在生产环境中使用，Promise都已经是规范了，哪还需要自己去写；实现思路参考自then/promise。

## demo
```bash
npm install

node server
```
打开[http://localhost:8080/examples/01.html](http://localhost:8080/examples/01.html)。这些demo都算是测试用例，需要在控制台里面查看运行结果。

下一步：
* 在有添加catch的时候，如何避免console.error的调用
* 替换setTimeout为asap
* 实现Promise.all以及Promise.race
