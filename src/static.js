import Promise from "./core.js";
import util from "./util";

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

}

Promise.all = function () {

}

Promise.race = function () {

}