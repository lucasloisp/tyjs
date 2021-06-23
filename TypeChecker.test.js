const Type = require("./TypeChecker.js");

describe("the type checker", () => {
  describe("checking for atomic types", () => {
    test("the undefined type only matches the undefined value", () => {
      const undefinedType = new Type("undefined");
      expect(undefinedType.checks(undefined)).toBe(true);
      expect(undefinedType.checks(1)).toBe(false);
    });
    test("the boolean type matches boolean values", () => {
      const booleanType = new Type("boolean");
      expect(booleanType.checks(true)).toBe(true);
      expect(booleanType.checks(false)).toBe(true);
      expect(booleanType.checks(1)).toBe(false);
    });
    test("the symbol type matches all symbols", () => {
      const symbolType = new Type("symbol");
      expect(symbolType.checks(Symbol())).toBe(true);
      expect(symbolType.checks(Symbol("hello"))).toBe(true);
      expect(symbolType.checks("hello")).toBe(false);
    });
    test("the number type matches all numbers", () => {
      const numberType = new Type("number");
      expect(numberType.checks(1)).toBe(true);
      expect(numberType.checks(1.3)).toBe(true);
      expect(numberType.checks(1.3e12)).toBe(true);
      expect(numberType.checks(0xa1)).toBe(true);
      expect(numberType.checks("hello")).toBe(false);
    });
    test("the any type matches all possible values", () => {
      const anyType = new Type("any");
      expect(anyType.checks(Symbol())).toBe(true);
      expect(anyType.checks(Symbol("hello"))).toBe(true);
      expect(anyType.checks(123123)).toBe(true);
      expect(anyType.checks("hello")).toBe(true);
    });
    test("the big int type matches Big Int values", () => {
      const bigIntType = new Type("bigint");
      expect(bigIntType.checks(1n)).toBe(true);
      expect(bigIntType.checks(1)).toBe(false);
      expect(bigIntType.checks(BigInt(1))).toBe(true);
      expect(bigIntType.checks(BigInt(1n))).toBe(true);
      expect(bigIntType.checks(2147483647)).toBe(false);
      expect(bigIntType.checks(2147483648)).toBe(false);
      expect(bigIntType.checks(Number.MAX_SAFE_INTEGER)).toBe(false);
      expect(bigIntType.checks(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
      expect(bigIntType.checks(Number.MAX_VALUE)).toBe(false);
      expect(bigIntType.checks(Number.MAX_VALUE + 1)).toBe(false);
    });
    test("the function type matches functions", () => {
      const functionType = new Type("function");
      expect(functionType.checks(() => 0)).toBe(true);
      expect(
        functionType.checks(function () {
          return 0;
        })
      ).toBe(true);
      expect(
        functionType.checks(function oneWithAName() {
          return 0;
        })
      ).toBe(true);
      expect(functionType.checks(1)).toBe(false);
    });
    test("the void type matches null or undefined", () => {
      const voidType = new Type("void");
      expect(voidType.checks(null)).toBe(true);
      expect(voidType.checks(undefined)).toBe(true);
      expect(voidType.checks(0)).toBe(false);
      expect(voidType.checks("")).toBe(false);
      expect(voidType.checks(NaN)).toBe(false);
    });
    test("the int type matches whole numbers", () => {
      const intType = new Type("int");
      expect(intType.checks(1)).toBe(true);
      expect(intType.checks(1.1)).toBe(false);
      expect(intType.checks(NaN)).toBe(false);
      expect(intType.checks(Infinity)).toBe(false);
      expect(intType.checks(-Infinity)).toBe(false);
      expect(intType.checks(0)).toBe(true);
      expect(intType.checks(-1)).toBe(true);
      expect(intType.checks(-1.4)).toBe(false);
      expect(intType.checks(null)).toBe(false);
    });
    test("the double type matches double precision floating point numbers", () => {
      const doubleType = new Type("double");
      expect(doubleType.checks(1)).toBe(false);
      expect(doubleType.checks(1.1)).toBe(true);
      expect(doubleType.checks(NaN)).toBe(true);
      expect(doubleType.checks(Infinity)).toBe(true);
      expect(doubleType.checks(-Infinity)).toBe(true);
      expect(doubleType.checks(0)).toBe(false);
      expect(doubleType.checks(-1)).toBe(false);
      expect(doubleType.checks(-1.4)).toBe(true);
      expect(doubleType.checks(null)).toBe(false);
    });
    test("the char type matches single character strings", () => {
      const charType = new Type("char");
      expect(charType.checks("a")).toBe(true);
      expect(charType.checks("")).toBe(false);
      expect(charType.checks([1])).toBe(false);
      expect(charType.checks("🙆")).toBe(false);
    });
    test("the byte type matches numbers from 0 to 255", () => {
      const byteType = new Type("byte");
      for (let i = 0; i <= 255; i++) {
        expect(byteType.checks(i)).toBe(true);
      }
      expect(byteType.checks(-0)).toBe(true);
      expect(byteType.checks(256)).toBe(false);
      expect(byteType.checks(1.2)).toBe(false);
    });
  });
  describe("checking on operators applied to types", () => {
    describe("the not operator", () => {
      test("it matches no values when you negate any", () => {
        const notAnyType = new Type("!any");
        expect(notAnyType.checks(1)).toBe(false);
        expect(notAnyType.checks(2)).toBe(false);
        expect(notAnyType.checks("hello")).toBe(false);
      });
      test("it matches all values but null and undefined when you negate void", () => {
        const notVoidType = new Type("!void");
        expect(notVoidType.checks(1)).toBe(true);
        expect(notVoidType.checks(null)).toBe(false);
      });
    });
    describe("the and operator", () => {
      test("it matches values that are in both atomic types", () => {
        const byteAndInt = new Type("byte & int");
        for (let i = 0; i <= 255; i++) {
          expect(byteAndInt.checks(i)).toBe(true);
        }
        expect(byteAndInt.checks(-1)).toBe(false);
        expect(byteAndInt.checks(256)).toBe(false);
      });
      test("it matches no values when adding two disjoint types", () => {
        const booleanAndNumber = new Type("boolean & number");
        expect(booleanAndNumber.checks(1)).toBe(false);
        expect(booleanAndNumber.checks(true)).toBe(false);
      });
      test("it works with the conjunction of negated types", () => {
        const intAndNotByte = new Type("int & !byte");
        expect(intAndNotByte.checks(-1)).toBe(true);
        expect(intAndNotByte.checks(0)).toBe(false);
        expect(intAndNotByte.checks(10)).toBe(false);
        expect(intAndNotByte.checks(255)).toBe(false);
        expect(intAndNotByte.checks(256)).toBe(true);
      });
    });
    describe("the or operator", () => {
      test("it matches values that are either byte or int or both", () => {
        const byteOrInt = new Type("byte | int");
        for (let i = 0; i <= 255; i++) {
          expect(byteOrInt.checks(i)).toBe(true);
        }
        expect(byteOrInt.checks(-1)).toBe(true);
        expect(byteOrInt.checks(256)).toBe(true);
        expect(byteOrInt.checks(1.5)).toBe(false);
      });
      test("it matches both values when applying it to two primitive types", () => {
        const booleanOrNumber = new Type("boolean | number");
        expect(booleanOrNumber.checks(1)).toBe(true);
        expect(booleanOrNumber.checks(true)).toBe(true);
      });
      test("it works with the applying or to negated types", () => {
        const intOrNotByte = new Type("int | !byte");
        expect(intOrNotByte.checks(-1)).toBe(true);
        expect(intOrNotByte.checks(0)).toBe(true);
        expect(intOrNotByte.checks(10)).toBe(true);
        expect(intOrNotByte.checks(255)).toBe(true);
        expect(intOrNotByte.checks(256)).toBe(true);
      });
    });
  });
  describe("the value types", () => {
    test("it works with parsing single-value types", () => {
      const theSeventeenType = new Type("17");
      expect(theSeventeenType.checks(17)).toBe(true);
      expect(theSeventeenType.checks(0)).toBe(false);
      expect(theSeventeenType.checks("17")).toBe(false);
    });
  });
});
