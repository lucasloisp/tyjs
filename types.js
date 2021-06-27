function matchValueBasedOnTypeof(value) {
  return typeof value === this.type;
}

function typeCreator({ type, match, ...rest }) {
  return Object.freeze({
    ...rest,
    type,
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

function matchesAnd(value) {
  return this.left.match(value) && this.right.match(value);
}

function and(typeL, typeR) {
  return typeCreator({
    type: "and",
    left: typeL,
    right: typeR,
    match: matchesAnd,
  });
}

function matchesOr(value) {
  return this.left.match(value) || this.right.match(value);
}

function or(typeL, typeR) {
  return typeCreator({
    type: "or",
    left: typeL,
    right: typeR,
    match: matchesOr,
  });
}

function minus(typeL, typeR) {
  return and(typeL, not(typeR));
}

function matchesValueType(value) {
  return this.value === value;
}

function valueType(value) {
  return typeCreator({
    type: "value",
    value,
    match: matchesValueType,
  });
}

function arrayOfValuesType(values) {
  return values.map(valueType).reduce(or);
}

function matchRegex(value) {
  return !!value.toString().match(this.regex);
}

function regexType(regex) {
  return typeCreator({
    type: "regex",
    regex,
    match: matchRegex,
  });
}

function matchSequenceType(seq) {
  if (!seq || typeof seq[Symbol.iterator] !== "function") {
    return false;
  }
  seq = Array.from(seq);

  let valueIx = 0;
  for (let typeIx = 0; typeIx < this.left.length; typeIx++) {
    const type = this.left[typeIx];
    if (type.type === "singleSeq") {
      if (valueIx >= seq.length) return false;
      const value = seq[valueIx++];
      if (!type.left.match(value)) {
        return false;
      }
    } else {
      while (valueIx < seq.length) {
        const value = seq[valueIx];
        if (!type.match(value)) {
          break;
        }
        valueIx++;
      }
    }
  }
  return valueIx === seq.length;
}

function singleSeq(type) {
  return {
    type: "singleSeq",
    left: type,
  };
}

function sequenceType(elementTypes) {
  return typeCreator({
    type: "sequence",
    left: elementTypes,
    match: matchSequenceType,
  });
}

function matchClassType(obj) {
  return obj.constructor.name === this.left;
}

function classType(className) {
  return typeCreator({
    type: "class",
    left: className,
    match: matchClassType,
  });
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
  and,
  or,
  minus,
  valueType,
  arrayOfValuesType,
  regexType,
  sequenceType,
  singleSeq,
  classType,
};
