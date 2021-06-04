const nearley = require("nearley");
const grammar = require("./grammar.js");

let parser;
beforeEach(() => {
  parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
});

function expectToUnambiguouslyEvaluateTo(string, value) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  let { results: parseResult } = parser.feed(string);
  expect(parseResult.length).toBe(1);
  expect(parseResult).toContain(value);
}

describe("the language's grammar", () => {
  describe("the primitives in the language", () => {
    test("numbers are a part of the grammar", () => {
      expectToUnambiguouslyEvaluateTo("0", 0);
      expectToUnambiguouslyEvaluateTo("188498210", 188498210);
    });
    test("booleans are a part of the grammar", () => {
      expectToUnambiguouslyEvaluateTo("true", true);
      expectToUnambiguouslyEvaluateTo("false", false);
    });
  });
  describe("boolean operators", () => {
    describe("not operator", () => {
      test("flips boolean primitives", () => {
        expectToUnambiguouslyEvaluateTo("!true", false);
        expectToUnambiguouslyEvaluateTo("!false", true);
      });
      test("acts on the truthiness of numbers", () => {
        expectToUnambiguouslyEvaluateTo("!0", true);
        expectToUnambiguouslyEvaluateTo("!1", false);
        expectToUnambiguouslyEvaluateTo("!124124", false);
      });
    });
  });
  describe("arithmetic operators", () => {
    describe("negation operator", () => {
      test("gives negative numbers", () => {
        expectToUnambiguouslyEvaluateTo("-1", -1);
        expectToUnambiguouslyEvaluateTo("-144", -144);
      });
      test("is idempotent on zero", () => {
        expectToUnambiguouslyEvaluateTo("-0", 0);
      });
      test("is its own inverse", () => {
        expectToUnambiguouslyEvaluateTo("--1", 1);
        expectToUnambiguouslyEvaluateTo("--124142", 124142);
        expectToUnambiguouslyEvaluateTo("--0", 0);
      });
    });
    describe("addition operator", () => {
      test("adds positive numeric primitives", () => {
        expectToUnambiguouslyEvaluateTo("1+1", 2);
        expectToUnambiguouslyEvaluateTo("0+1", 1);
        expectToUnambiguouslyEvaluateTo("1+0", 1);
        expectToUnambiguouslyEvaluateTo("1124+6321", 1124 + 6321);
      });
      test("adds negated numbers", () => {
        expectToUnambiguouslyEvaluateTo("-1+1", 0);
        expectToUnambiguouslyEvaluateTo("1+(-1)", 0);
        expectToUnambiguouslyEvaluateTo("14+(-1)", 13);
      });
      test("adds booleans as numeric bits", () => {
        expectToUnambiguouslyEvaluateTo("1+false", 1);
        expectToUnambiguouslyEvaluateTo("1+true", 2);
        expectToUnambiguouslyEvaluateTo("false+1", 1);
        expectToUnambiguouslyEvaluateTo("true+1", 2);
        expectToUnambiguouslyEvaluateTo("true+true", 2);
        expectToUnambiguouslyEvaluateTo("false+true", 1);
        expectToUnambiguouslyEvaluateTo("false+false", 0);
        expectToUnambiguouslyEvaluateTo("true+false", 1);
      });
    });
    describe("multiplication operator", () => {
      test("multiplies positive numeric primitives", () => {
        expectToUnambiguouslyEvaluateTo("1*1", 1);
        expectToUnambiguouslyEvaluateTo("0*1", 0);
        expectToUnambiguouslyEvaluateTo("1*0", 0);
        expectToUnambiguouslyEvaluateTo("1423*1", 1423);
        expectToUnambiguouslyEvaluateTo("1*1423", 1423);
        expectToUnambiguouslyEvaluateTo("1124*6321", 1124 * 6321);
      });
      test("multiplies negated numbers", () => {
        expectToUnambiguouslyEvaluateTo("-1*1", -1);
        expectToUnambiguouslyEvaluateTo("1*(-1)", -1);
        expectToUnambiguouslyEvaluateTo("14*(-1)", -14);
      });
      test("multiplies booleans as numeric bits", () => {
        expectToUnambiguouslyEvaluateTo("1*false", 0);
        expectToUnambiguouslyEvaluateTo("1*true", 1);
        expectToUnambiguouslyEvaluateTo("false*1", 0);
        expectToUnambiguouslyEvaluateTo("true*1", 1);
        expectToUnambiguouslyEvaluateTo("true*true", 1);
        expectToUnambiguouslyEvaluateTo("false*true", 0);
        expectToUnambiguouslyEvaluateTo("false*false", 0);
        expectToUnambiguouslyEvaluateTo("true*false", 0);
      });
    });
  });
  describe("division operator", () => {
    test("divides positive numeric primitives", () => {
      expectToUnambiguouslyEvaluateTo("1/1", 1);
      expectToUnambiguouslyEvaluateTo("0/1", 0);
      expectToUnambiguouslyEvaluateTo("1/0", Infinity);
      expectToUnambiguouslyEvaluateTo("1423/1", 1423);
      expectToUnambiguouslyEvaluateTo("1/1423", 1 / 1423);
      expectToUnambiguouslyEvaluateTo("1124/6321", 1124 / 6321);
    });
    test("divides negated numbers", () => {
      expectToUnambiguouslyEvaluateTo("-1/1", -1);
      expectToUnambiguouslyEvaluateTo("1/(-1)", -1);
      expectToUnambiguouslyEvaluateTo("14/(-1)", -14);
    });
    test("divides booleans as numeric bits", () => {
      expectToUnambiguouslyEvaluateTo("1/false", Infinity);
      expectToUnambiguouslyEvaluateTo("1/true", 1);
      expectToUnambiguouslyEvaluateTo("false/1", 0);
      expectToUnambiguouslyEvaluateTo("true/1", 1);
      expectToUnambiguouslyEvaluateTo("true/true", 1);
      expectToUnambiguouslyEvaluateTo("false/true", 0);
      expectToUnambiguouslyEvaluateTo("true/false", Infinity);
    });
  });
  describe("precedence rules", () => {
    test("multiplication precedes addition", () => {
      expectToUnambiguouslyEvaluateTo("2*2+3*4", 2 * 2 + 3 * 4);
      expectToUnambiguouslyEvaluateTo("1+3*4", 1 + 3 * 4);
      expectToUnambiguouslyEvaluateTo(
        "1231*1412+1823*1241",
        1231 * 1412 + 1823 * 1241
      );
    });
  });
  describe("parentheses", () => {
    test("are superfluous on terminals", () => {
      expectToUnambiguouslyEvaluateTo("(0)", 0);
      expectToUnambiguouslyEvaluateTo("(1)", 1);
      expectToUnambiguouslyEvaluateTo("(124124)", 124124);
      expectToUnambiguouslyEvaluateTo("(true)", true);
      expectToUnambiguouslyEvaluateTo("(false)", false);
    });
  });
});
