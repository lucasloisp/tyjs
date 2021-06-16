function matchValueBasedOnTypeof(value) {
  return typeof value === this.type;
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

function matchValuesOnVoidType(value) {
  return value === null || value === undefined;
}

function voidType() {
  return typeCreator({ type: "void", match: matchValuesOnVoidType });
}

function intType() {
  return typeCreator({ type: "int", match: Number.isInteger });
}

function isDouble(value) {
  return typeof value === "number" && !Number.isInteger(value);
}

function doubleType() {
  return typeCreator({ type: "double", match: isDouble });
}

function isChar(value) {
  return typeof value === "string" && value.length === 1;
}

function charType() {
  return typeCreator({ type: "char", match: isChar });
}

function isByte(value) {
  return Number.isInteger(value) && value >= 0 && value <= 255;
}

function byteType() {
  return typeCreator({ type: "byte", match: isByte });
}

function isAny() {
  return true;
}

function anyType() {
  return typeCreator({ type: "any", match: isAny });
}

function matchesNotType(value) {
  return !this.left.match(value);
}

function not(type) {
  return typeCreator({ type: "not", left: type, match: matchesNotType });
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
