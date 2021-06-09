const nearley = require("nearley");
const grammar = require("./grammar.js");
const ty = require("./types");

let parser;
beforeEach(() => {
    parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

function expectToUnambiguouslyEvaluateTo(string, value) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    let {results: parseResult} = parser.feed(string);
    expect(parseResult.length).toBe(1);
    expect(parseResult).toContainEqual(value);
}

describe("the language's grammar", () => {
    describe("the atomic types", () => {
        test("parses the atomic types", () => {
            expectToUnambiguouslyEvaluateTo("undefined", ty.undefinedType());
            expectToUnambiguouslyEvaluateTo("boolean", ty.booleanType());
            expectToUnambiguouslyEvaluateTo("number", ty.numberType());
            expectToUnambiguouslyEvaluateTo("string", ty.stringType());
            expectToUnambiguouslyEvaluateTo("function", ty.functionType());
            expectToUnambiguouslyEvaluateTo("symbol", ty.symbolType());
            expectToUnambiguouslyEvaluateTo("object", ty.objectType());
            expectToUnambiguouslyEvaluateTo("bigint", ty.bigintType());
            expectToUnambiguouslyEvaluateTo("void", ty.voidType());
            expectToUnambiguouslyEvaluateTo("int", ty.intType());
            expectToUnambiguouslyEvaluateTo("double", ty.doubleType());
            expectToUnambiguouslyEvaluateTo("char", ty.charType());
            expectToUnambiguouslyEvaluateTo("byte", ty.byteType());
            expectToUnambiguouslyEvaluateTo("any", ty.anyType());
        });
        // expectToUnambiguouslyEvaluateTo("bigint", ty.bigintType());
    });
});
