const ty = require("./types.js");

describe("the types in TyJS", () => {
  describe("the atomic types", () => {
    test("the undefined type", () => {
      expect(ty.undefinedType()).toMatchObject({ type: "undefined" });
    });
    test("the boolean type", () => {
      expect(ty.booleanType()).toMatchObject({ type: "boolean" });
    });
    test("the number type", () => {
      expect(ty.numberType()).toMatchObject({ type: "number" });
    });
    test("the string type", () => {
      expect(ty.stringType()).toMatchObject({ type: "string" });
    });
    test("the function type", () => {
      expect(ty.functionType()).toMatchObject({ type: "function" });
    });
    test("the symbol type", () => {
      expect(ty.symbolType()).toMatchObject({ type: "symbol" });
    });
    test("the object type", () => {
      expect(ty.objectType()).toMatchObject({ type: "object" });
    });
    test("the bigint type", () => {
      expect(ty.bigintType()).toMatchObject({ type: "bigint" });
    });
    test("the void type", () => {
      expect(ty.voidType()).toMatchObject({ type: "void" });
    });
    test("the int type", () => {
      expect(ty.intType()).toMatchObject({ type: "int" });
    });
    test("the double type", () => {
      expect(ty.doubleType()).toMatchObject({ type: "double" });
    });
    test("the char type", () => {
      expect(ty.charType()).toMatchObject({ type: "char" });
    });
    test("the byte type", () => {
      expect(ty.byteType()).toMatchObject({ type: "byte" });
    });
    test("the any type", () => {
      expect(ty.anyType()).toMatchObject({ type: "any" });
    });
  });
  describe("the type operators", () => {
    describe("the not operator", () => {
      test("it has a reference to another type", () => {
        expect(ty.not(ty.undefinedType())).toMatchObject({
          type: "not",
          left: ty.undefinedType(),
        });
      });
    });
    describe("the and operator", () => {
      test("it has a reference to two other types", () => {
        expect(ty.and(ty.undefinedType(), ty.voidType())).toMatchObject({
          type: "and",
          left: ty.undefinedType(),
          right: ty.voidType(),
        });
      });
    });
    describe("the or operator", () => {
      test("it has a reference to two other types", () => {
        expect(ty.or(ty.undefinedType(), ty.voidType())).toMatchObject({
          type: "or",
          left: ty.undefinedType(),
          right: ty.voidType(),
        });
      });
    });
  });
  describe("the value-types", () => {
    test("it is a type that holds a value in it to match", () => {
      expect(ty.valueType(1.421)).toMatchObject({
        type: "value",
        value: 1.421,
      });
    });
  });
  describe("the sequence type", () => {
    test("it handles a homogeneous sequence of types", () => {
      expect(ty.sequenceType(ty.numberType())).toMatchObject({
        type: "sequence",
        left: ty.numberType(),
      });
    });
  });
  describe("the class type", () => {
    test("it handles a custom class type", () => {
      expect(ty.classType("Date")).toMatchObject({
        type: "class",
        left: "Date",
      });
    });
  });
});
