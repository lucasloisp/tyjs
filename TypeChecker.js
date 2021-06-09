const nearley = require("nearley");
const grammar = require("./grammar.js");

class Type {
    constructor(typeDescription, checkFunctions = []) {
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        const {results: parseResult} = parser.feed(typeDescription);
        this.typeTree = parseResult[0];
    }

    checks(value) {
        const typeIMatch = this.typeTree.type;
        if (typeIMatch === 'void') {
            return value === null || value === undefined;
        }
        return typeIMatch === 'any' || typeof value === typeIMatch;
    }
}



function type(typeDescription) {
    return new Type(typeDescription);
}

module.exports = type;