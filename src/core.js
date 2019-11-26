// LAST_ERROR与IS_ERROR的设定充分利用了js是单线程运行的优势
import util from "./util.js";

let LAST_ERROR = null
let IS_ERROR = {}
let STATES = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
}

function noop() {
}

function tryCallOne(fn, one) {
    try {
        return fn(one)
    } catch (e) {
        LAST_ERROR = e
        return IS_ERROR
    }
}

function tryCallTwo(fn, one, two) {
    try {
        return fn(one, two)
    } catch (e) {
        LAST_ERROR = e
        return IS_ERROR
    }
}

function Promise(asyncTask) {
    this._state = STATES.PENDING
    this._data = null
    this._reason = null
    this._deferreds = []//then方法返回的promise都会以deferred对象的形式存储在此数组中
    if (!asyncTask) asyncTask = noop
    makePromise(asyncTask, this)
}

function makePromise(asyncTask, promise) {
    let executed = false
    let ret = tryCallTwo(
        asyncTask,
        function (data) {
            if (executed) return

            executed = true
            resolvePromise(promise, data)
        }, function (reason) {
            if (executed) return

            executed = true
            rejectPromise(promise, reason)
        }
    )

    if (ret === IS_ERROR && !executed) {
        // ret等于IS_ERROR也有可能是asyncTask内部调用了resolve之后的代码有错导致的，所以要加一个!excecuted判断
        executed = true
        rejectPromise(promise, ret)
    }
}

function resolvePromise(promise, data) {
    if (promise === data) {
        return rejectPromise(promise, new Error('promise cannot be resolved by itself'))
    }

    let transferPromise = null

    if (util.thenable(data)) {
        // 创建一个新的Promise实例
        // 并且把当前promise的状态转由新promise来处理
        transferPromise = new Promise(data.then.bind(data))
    } else if (data && util.isObject(data) && data instanceof Promise) {
        // 如果asyncTask内部resolve传入了一个新的promise，也就是data指向的对象
        // 则当前promise的状态应转由data实例来处理
        transferPromise = data
    } else {
        promise._state = STATES.RESOLVED
        promise._data = data
        return finishPromise(promise)
    }

    transferPromise.then(
        data => resolvePromise(promise, data),
        reason => rejectPromise(promise, reason)
    )
}

function rejectPromise(promise, reason) {
    promise._state = STATES.REJECTED
    promise._reason = reason instanceof Error ? reason : new Error(reason)
    finishPromise(promise)
}

function finishPromise(promise) {
    for (let deferred of promise._deferreds) {
        handleDeferred(promise, deferred)
    }
    promise._deferreds = []//必须清空，否则再对已经resolved的实例继续添加回调，会导致以前的回调再次被调用
}

function handleDeferred(promise, deferred) {
    // 此处setTimeout应该用micro-task的方式替代
    // https://github.com/kriskowal/asap
    setTimeout(function () {
        let onFulfilled = util.isFunction(deferred.onFulfilled) ? deferred.onFulfilled : null
        let onRejected = util.isFunction(deferred.onRejected) ? deferred.onRejected : null
        let cb = promise._state === STATES.RESOLVED ? onFulfilled : onRejected
        let param = promise._state === STATES.RESOLVED ? promise._data : promise._reason

        let ret = cb && tryCallOne(cb, param)
        if (ret === IS_ERROR) {
            rejectPromise(deferred.promise, LAST_ERROR)
        } else if (util.isObject(ret) && ret instanceof Promise) {
            ret.then(
                data => resolvePromise(deferred.promise, data),
                reason => rejectPromise(deferred.promise, reason)
            )
        } else if (cb || promise._state === STATES.RESOLVED) {
            resolvePromise(deferred.promise, cb ? ret : param)
        } else {
            rejectPromise(deferred.promise, param)
        }

        if (promise._state === STATES.REJECTED && !param.logState) {
            param.logState = true;
            console.error('this log comes from console.error() ==>',param);
        }
    })
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let p = new Promise()
    this._deferreds.push(new Deferred(p, onFulfilled, onRejected))

    if (this._state !== STATES.PENDING) {
        finishPromise(this)
    }
    return p
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected)
}

Promise.prototype.done = function () {
    this.catch(reason => {
        setTimeout(() => {
            throw reason;
        }, 0)
    })
}

function Deferred(promise, onFulfilled, onRejected) {
    this.promise = promise
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
}

export default Promise