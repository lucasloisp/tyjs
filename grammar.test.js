const nearley = require("nearley");
const grammar = require("./grammar.js");
const ty = require("./types");

let parser;
beforeEach(() => {
  parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

function expectToUnambiguouslyEvaluateTo(string, value) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  let { results: parseResult } = parser.feed(string);
  expect(parseResult.length).toBe(1);
  expect(parseResult).toContainEqual(value);
}

function expectToBeASyntaxError(string) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  let { results: parseResult } = parser.feed(string);
  expect(parseResult.length).toBe(0);
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
      expectToUnambiguouslyEvaluateTo("_", ty.anyType());
    });
  });
  describe("the operators", () => {
    describe("the not operator", () => {
      test("parses the negation of an atomic type", () => {
        expectToUnambiguouslyEvaluateTo("!undefined", ty.not(ty.undefinedType()));
        expectToUnambiguouslyEvaluateTo("!boolean", ty.not(ty.booleanType()));
        expectToUnambiguouslyEvaluateTo("!number", ty.not(ty.numberType()));
        expectToUnambiguouslyEvaluateTo("!string", ty.not(ty.stringType()));
        expectToUnambiguouslyEvaluateTo("!function", ty.not(ty.functionType()));
        expectToUnambiguouslyEvaluateTo("!symbol", ty.not(ty.symbolType()));
        expectToUnambiguouslyEvaluateTo("!object", ty.not(ty.objectType()));
        expectToUnambiguouslyEvaluateTo("!bigint", ty.not(ty.bigintType()));
        expectToUnambiguouslyEvaluateTo("!void", ty.not(ty.voidType()));
        expectToUnambiguouslyEvaluateTo("!int", ty.not(ty.intType()));
        expectToUnambiguouslyEvaluateTo("!double", ty.not(ty.doubleType()));
        expectToUnambiguouslyEvaluateTo("!char", ty.not(ty.charType()));
        expectToUnambiguouslyEvaluateTo("!byte", ty.not(ty.byteType()));
        expectToUnambiguouslyEvaluateTo("!any", ty.not(ty.anyType()));
        expectToUnambiguouslyEvaluateTo("!_", ty.not(ty.anyType()));
      });
      test("parses a double and triple negation", () => {
        expectToUnambiguouslyEvaluateTo("!!undefined", ty.not(ty.not(ty.undefinedType())));
        expectToUnambiguouslyEvaluateTo("!!!undefined", ty.not(ty.not(ty.not(ty.undefinedType()))));
      });
      test("you need a type to be negated", () => {
        expectToBeASyntaxError("!");
        expectToBeASyntaxError("!!");
      });
    })
  })
});
