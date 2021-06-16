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
  });
});
