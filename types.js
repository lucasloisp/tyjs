function matchValueBasedOnTypeof(value) {
  return typeof value === this.type
}

function typeCreator({ type, left, match }) {
  return Object.freeze({
    type,
    left,
    match: match || matchValueBasedOnTypeof,
  });
}

function undefinedType() {
  return typeCreator({ type: "undefined" });
}

function booleanType() {
  return typeCreator({ type: "boolean" });
}

function numberType() {
  return typeCreator({ type: "number" });
}

function stringType() {
  return typeCreator({ type: "string" });
}

function functionType() {
  return typeCreator({ type: "function" });
}

function symbolType() {
  return typeCreator({ type: "symbol" });
}

function objectType() {
  return typeCreator({ type: "object" });
}

function bigintType() {
  return typeCreator({ type: "bigint" });
}

function voidType() {
  return typeCreator({ type: "void" });
}

function intType() {
  return typeCreator({ type: "int" });
}

function doubleType() {
  return typeCreator({ type: "double" });
}

function charType() {
  return typeCreator({ type: "char" });
}

function byteType() {
  return typeCreator({ type: "byte" });
}

function anyType() {
  return typeCreator({ type: "any" });
}

function not(type) {
  return typeCreator({ type: "not", left: type });
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
  voidType,
  intType,
  doubleType,
  charType,
  byteType,
  anyType,
  not,
};
