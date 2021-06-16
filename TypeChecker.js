const nearley = require("nearley");
const grammar = require("./grammar.js");

class Type {
  constructor(typeDescription, checkFunctions = []) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    const { results: parseResult } = parser.feed(typeDescription);
    this.typeTree = parseResult[0];
  }

  checks(value) {
    return this.typeTree.match(value);
  }
}

module.exports = Type;
