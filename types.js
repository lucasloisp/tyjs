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

function matchesNotType(value, ctx) {
  return !this.left.match(value, ctx);
}

function not(type) {
  return typeCreator({ type: "not", left: type, match: matchesNotType });
}

function matchesAnd(value, ctx) {
  return this.left.match(value, ctx) && this.right.match(value, ctx);
}

function and(typeL, typeR) {
  return typeCreator({
    type: "and",
    left: typeL,
    right: typeR,
    match: matchesAnd,
  });
}

function matchesOr(value, ctx) {
  return this.left.match(value, ctx) || this.right.match(value, ctx);
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

function times(type, count) {
  let types = [];
  for (let i = 0; i < count; i++) {
    types.push(singleSeq(type));
  }
  return types;
}

function matchSequenceType(seq, ctx) {
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
      if (!type.left.match(value, ctx)) {
        return false;
      }
    } else {
      while (valueIx < seq.length) {
        const value = seq[valueIx];
        if (!type.match(value, ctx)) {
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
    left: elementTypes.flat(),
    match: matchSequenceType,
  });
}
function matchObjectTypes(obj) {
  const lenghtOfLeft = this.left.length;
  const lenghtOfObj = Object.entries(obj).length;
  // const decomposedRegex = this.left.some((element) => element.length === 3);
  const typeSet = new Set(this.left);
  const allValuesInObjectMatch = Object.entries(obj).every(([key, val]) => {
    return this.left.some((v) => {
      const [prop, type, isDecomposed] = v;
      const isUsed = !typeSet.has(v);
      if (isUsed) {
        return false;
      }
      let isMatch;
      if (prop instanceof RegExp) {
        isMatch = key.toString().match(prop) && type.match(val);
      } else {
        isMatch = prop === key && type.match(val);
      }
      if (isMatch && !isDecomposed) {
        typeSet.delete(v);
      }
      return isMatch;
    });
  });
  const allTypesMatch = Array.from(typeSet).every(
    ([prop, type, isDecomposed]) => {
      return isDecomposed;
    }
  );
  return (allValuesInObjectMatch || this.isOpen) && allTypesMatch;
}
function objectsType(properties, isOpen) {
  return typeCreator({
    type: "objects",
    left: properties,
    isOpen,
    match: matchObjectTypes,
  });
}

function matchClassType(obj, ctx) {
  const objectClass = obj.constructor.name;
  const classToMatch = this.left;
  return (
    objectClass === classToMatch &&
    (this.generics.length === 0 ||
      ctx.classCheckers(objectClass)(
        obj,
        this.generics.map((t) => (v) => t.match(v, ctx))
      ))
  );
}

function classType(className, generics = []) {
  return typeCreator({
    type: "class",
    left: className,
    generics,
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
  objectsType,
  classType,
  times,
};
