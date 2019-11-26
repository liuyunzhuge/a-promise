
let isObject = obj => typeof obj === 'object'
let thenable = obj => !!obj && isObject(obj) && (typeof obj.then) === 'function'
let isFunction = obj => typeof obj === 'function'

export default {
    isObject,
    thenable,
    isFunction
}