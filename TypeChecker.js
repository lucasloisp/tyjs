const nearley = require("nearley");
const grammar = require("./grammar.js");

class Type {
  static globalCheckers = new Map();

  constructor(typeDescription, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    let parseResult;
    try {
      ({ results: parseResult } = parser.feed(typeDescription));
    } catch (err) {
      throw new Error("Syntax error");
    }
    if (parseResult.length === 0) throw new Error("Syntax error");
    this.typeTree = parseResult[0];
    this.classCheckers = new Map();
  }

  getClassCheckerFor(cls) {
    const checker = this.classCheckers.get(cls);
    const globalChecker = Type.globalCheckers.get(cls);
    if (!checker && !globalChecker)
      throw new Error(`${cls} has no checking for generics`);
    return checker || globalChecker;
  }

  checks(value) {
    return this.typeTree.match(value, {
      classCheckers: (cls) => this.getClassCheckerFor(cls),
    });
  }

  classChecker(cls, checker) {
    this.classCheckers.set(cls.name, checker);
  }

  static classChecker(cls, checker) {
    Type.globalCheckers.set(cls.name, checker);
  }
}

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

Type.classChecker(Array, genericSequenceChecker);
Type.classChecker(Set, genericSequenceChecker);
Type.classChecker(Map, mapChecker);

module.exports = Type;
