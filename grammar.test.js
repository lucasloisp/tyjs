const nearley = require("nearley");
const grammar = require("./grammar.js");
const ty = require("./types");

function expectToUnambiguouslyEvaluateTo(string, value) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  let { results: parseResult } = parser.feed(string);
  expect(parseResult.length).toBe(1);
  expect(parseResult[0]).toMatchObject(value);
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
        expectToUnambiguouslyEvaluateTo(
          "!undefined",
          ty.not(ty.undefinedType())
        );
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
        expectToUnambiguouslyEvaluateTo(
          "!!undefined",
          ty.not(ty.not(ty.undefinedType()))
        );
        expectToUnambiguouslyEvaluateTo(
          "!!!undefined",
          ty.not(ty.not(ty.not(ty.undefinedType())))
        );
      });
      test("you need a type to be negated", () => {
        expectToBeASyntaxError("!");
        expectToBeASyntaxError("!!");
      });
    });
    describe("the and operator", () => {
      test("parses the conjunction of an atomic type", () => {
        expectToUnambiguouslyEvaluateTo(
          "int & number",
          ty.and(ty.intType(), ty.numberType())
        );
      });
      test("parses the conjunction of an atomic type even with multiple spaces", () => {
        expectToUnambiguouslyEvaluateTo(
          "int     &   number",
          ty.and(ty.intType(), ty.numberType())
        );
      });
      test("interacts with the not operator", () => {
        expectToUnambiguouslyEvaluateTo(
          "!int & number",
          ty.and(ty.not(ty.intType()), ty.numberType())
        );
        expectToUnambiguouslyEvaluateTo(
          "!int & !number",
          ty.and(ty.not(ty.intType()), ty.not(ty.numberType()))
        );
      });
      test("it associates to the left", () => {
        expectToUnambiguouslyEvaluateTo(
          "int & number & string",
          ty.and(ty.and(ty.intType(), ty.numberType()), ty.stringType())
        );
      });
    });
    describe("the or operator", () => {
      test("parses the disjunction of an atomic type", () => {
        expectToUnambiguouslyEvaluateTo(
          "int | number",
          ty.or(ty.intType(), ty.numberType())
        );
      });
      test("parses the disjunction of an atomic type even with multiple spaces", () => {
        expectToUnambiguouslyEvaluateTo(
          "int     |  number",
          ty.or(ty.intType(), ty.numberType())
        );
      });
      test("interacts with the not operator", () => {
        expectToUnambiguouslyEvaluateTo(
          "!int | number",
          ty.or(ty.not(ty.intType()), ty.numberType())
        );
        expectToUnambiguouslyEvaluateTo(
          "!int | !number",
          ty.or(ty.not(ty.intType()), ty.not(ty.numberType()))
        );
      });
      test("it interacts with the and operator", () => {
        expectToUnambiguouslyEvaluateTo(
          "int | number & byte",
          ty.and(ty.or(ty.intType(), ty.numberType()), ty.byteType())
        );
      });
      test("it associates to the left", () => {
        expectToUnambiguouslyEvaluateTo(
          "int | number | string",
          ty.or(ty.or(ty.intType(), ty.numberType()), ty.stringType())
        );
      });
    });
    describe("the minus operator", () => {
      test("parses the difference of two atomic types", () => {
        expectToUnambiguouslyEvaluateTo(
          "number - int",
          ty.and(ty.numberType(), ty.not(ty.intType()))
        );
        expectToUnambiguouslyEvaluateTo(
          "number - !int",
          ty.and(ty.numberType(), ty.not(ty.not(ty.intType())))
        );
      });
      test("it works with conjunctions and disjunctions", () => {
        expectToUnambiguouslyEvaluateTo(
          "number - int & string",
          ty.and(ty.minus(ty.numberType(), ty.intType()), ty.stringType())
        );
        expectToUnambiguouslyEvaluateTo(
          "number | boolean - int & string",
          ty.and(
            ty.minus(ty.or(ty.numberType(), ty.booleanType()), ty.intType()),
            ty.stringType()
          )
        );
        // expectToUnambiguouslyEvaluateTo(
        //     "number | boolean - int & string",
        //     ty.and(
        //         ty.or(ty.numberType(), ty.booleanType()),
        //         ty.not(ty.and(ty.intType(), ty.stringType()))
        //     )
        // )
      });
    });
  });
  describe("parentheses serve to disambiguate", () => {
    test("having parentheses on an atomic type is superfluous", () => {
      expectToUnambiguouslyEvaluateTo("(int)", ty.intType());
      expectToUnambiguouslyEvaluateTo("((((int))))", ty.intType());
      expectToUnambiguouslyEvaluateTo("(    int  )", ty.intType());
      expectToBeASyntaxError("(int");
    });
    test("having parentheses around top-level operations is superfluous", () => {
      expectToUnambiguouslyEvaluateTo("!int", ty.not(ty.intType()));
      expectToUnambiguouslyEvaluateTo("(!int)", ty.not(ty.intType()));
      expectToUnambiguouslyEvaluateTo(
        "int & number",
        ty.and(ty.intType(), ty.numberType())
      );
      expectToUnambiguouslyEvaluateTo(
        "(int & number)",
        ty.and(ty.intType(), ty.numberType())
      );
    });
    test("having parentheses binds operations first", () => {
      expectToUnambiguouslyEvaluateTo(
        "!int & number",
        ty.and(ty.not(ty.intType()), ty.numberType())
      );
      expectToUnambiguouslyEvaluateTo(
        "!(int & number)",
        ty.not(ty.and(ty.intType(), ty.numberType()))
      );
    });
  });
  describe("the value types", () => {
    test("the numeric values", () => {
      expectToUnambiguouslyEvaluateTo("1.421", ty.valueType(1.421));
      expectToUnambiguouslyEvaluateTo("4e2", ty.valueType(4e2));
      expectToUnambiguouslyEvaluateTo("4.2", ty.valueType(4.2));
      expectToUnambiguouslyEvaluateTo("4.2e1", ty.valueType(4.2e1));
      expectToUnambiguouslyEvaluateTo(".2e1", ty.valueType(0.2e1));
      expectToUnambiguouslyEvaluateTo(".2e1", ty.valueType(2));
      expectToUnambiguouslyEvaluateTo("-2", ty.valueType(-2));
      expectToUnambiguouslyEvaluateTo("-.121", ty.valueType(-0.121));
      expectToUnambiguouslyEvaluateTo("0x12", ty.valueType(0x12));
      expectToUnambiguouslyEvaluateTo("-0x12", ty.valueType(-0x12));
      expectToUnambiguouslyEvaluateTo("+0x12", ty.valueType(+0x12));
      expectToUnambiguouslyEvaluateTo("Infinity", ty.valueType(Infinity));
      expectToUnambiguouslyEvaluateTo("-Infinity", ty.valueType(-Infinity));
      expectToUnambiguouslyEvaluateTo("+Infinity", ty.valueType(+Infinity));
      expectToUnambiguouslyEvaluateTo("NaN", ty.valueType(NaN));
    });
    test("negative numbers are not the same as type difference", () => {
      expectToUnambiguouslyEvaluateTo(
        "string - 1",
        ty.minus(ty.stringType(), ty.valueType(1))
      );
      expectToUnambiguouslyEvaluateTo(
        "string - 1",
        ty.minus(ty.stringType(), ty.valueType(1))
      );
      expectToUnambiguouslyEvaluateTo("-1", ty.valueType(-1));
    });
    test("the boolean values", () => {
      expectToUnambiguouslyEvaluateTo("true", ty.valueType(true));
      expectToUnambiguouslyEvaluateTo("false", ty.valueType(false));
    });
    test("the string literal values", () => {
      expectToUnambiguouslyEvaluateTo('""', ty.valueType(""));
      expectToUnambiguouslyEvaluateTo('"hello"', ty.valueType("hello"));
    });
  });
  describe("the sequence type", () => {
    test("it can type homogeneous sequences", () => {
      expectToUnambiguouslyEvaluateTo(
        "[ ...number ]",
        ty.sequenceType([ty.numberType()])
      );
    });
    test("it can type a sequence of any type of elements", () => {
      expectToUnambiguouslyEvaluateTo(
        "[ ... ]",
        ty.sequenceType([ty.anyType()])
      );
    });
    test.skip("sequence of any can only go last", () => {
      expectToBeASyntaxError("[ ..., number]");
    });
  });
  describe("the class type", ()=>{
    expectToUnambiguouslyEvaluateTo(
        "Date",
        ty.classType("Date")
    );
  })
});
