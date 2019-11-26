import Promise from "./core.js";
import util from "./util.js";

Promise.resolve = function (obj) {
    let isValidObject = obj && util.isObject(obj);
    if (isValidObject && obj instanceof Promise) {
        return obj
    } else if (util.thenable(obj)) {
        return new Promise(obj.then.bind(obj));
    } else {
        return new Promise(resolve => resolve(obj));
    }
}

Promise.reject = function (obj) {
    return new Promise((resolve, reject) => { reject(obj) })
}

Promise.all = function (promises) {
    promises = Array.prototype.slice.call(promises);
    let total = promises.length;

    if (!total) return Promise.resolve([]);

    return new Promise((resolve, reject) => {
        for (let [i, promise] of promises.entries()) {
            Promise.resolve(promise)
                .then(data => {
                    total--;
                    promises[i] = data;

                    if (total === 0) {
                        resolve(promises);
                    }
                }).catch(reject);
        }
    })
}

Promise.race = function (promises) {
    promises = Array.prototype.slice.call(promises);

    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            Promise.resolve(promise).then(resolve, reject)
        }
    })
}