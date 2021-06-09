
function undefinedType() {
    return Object.freeze({ type: 'undefined'})
}

function booleanType() {
    return Object.freeze({ type: 'boolean'})
}

function numberType() {
    return Object.freeze({ type: 'number'})
}

function stringType() {
    return Object.freeze({ type: 'string'})
}

function functionType() {
    return Object.freeze({ type: 'function'})
}

function symbolType() {
    return Object.freeze({ type: 'symbol'})
}

function objectType() {
    return Object.freeze({ type: 'object'})
}

function bigintType() {
    return Object.freeze({ type: 'bigint'})
}

module.exports = {
    undefinedType,
    booleanType,
    numberType,
    stringType,
    functionType,
    symbolType,
    objectType,
    bigintType,
}
