const nearley = require("nearley");
const grammar = require("./grammar.js");

function genericSequenceChecker(obj, generics) {
  return generics.length === 1 && Array.from(obj).every((v) => generics[0](v));
}
function mapChecker(obj, generics) {
  return (
    generics.length === 2 &&
    Array.from(obj.entries()).every(
      ([k, v]) => generics[0](k) && generics[1](v)
    )
  );
}

class Type {
  constructor(typeDescription, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    const { results: parseResult } = parser.feed(typeDescription);
    this.typeTree = parseResult[0];
    this.classCheckers = new Map();
    this.classCheckers.set("Array", genericSequenceChecker);
    this.classCheckers.set("Set", genericSequenceChecker);
    this.classCheckers.set("Map", mapChecker);
  }

  checks(value) {
    return this.typeTree.match(value, (cls) => this.classCheckers.get(cls));
  }

  classChecker(cls, checker) {
    this.classCheckers.set(cls.name, checker);
  }
}

module.exports = Type;
