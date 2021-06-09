const type = require("./TypeChecker.js");
const ty = require("./types");

describe("the type checker", () => {
    describe("checking for atomic types", () => {
        test("the undefined type only matches the undefined value", () => {
            const undefinedType = type("undefined");
            expect(undefinedType.checks(undefined)).toBe(true);
            expect(undefinedType.checks(1)).toBe(false);
        });
        test("the boolean type matches boolean values", () => {
            const booleanType = type("boolean");
            expect(booleanType.checks(true)).toBe(true);
            expect(booleanType.checks(false)).toBe(true);
            expect(booleanType.checks(1)).toBe(false);
        })
        test("the symbol type matches all symbols", () => {
            const symbolType = type("symbol");
            expect(symbolType.checks(Symbol())).toBe(true);
            expect(symbolType.checks(Symbol("hello"))).toBe(true);
            expect(symbolType.checks("hello")).toBe(false);
        })
        test("the number type matches all numbers", () => {
            const numberType = type("number");
            expect(numberType.checks(1)).toBe(true);
            expect(numberType.checks(1.3)).toBe(true);
            expect(numberType.checks(1.3e12)).toBe(true);
            expect(numberType.checks(0xA1)).toBe(true);
            expect(numberType.checks("hello")).toBe(false);
        })
        test("the any type matches all possible values", () => {
            const anyType = type("any");
            expect(anyType.checks(Symbol())).toBe(true);
            expect(anyType.checks(Symbol("hello"))).toBe(true);
            expect(anyType.checks(123123)).toBe(true);
            expect(anyType.checks("hello")).toBe(true);
        })
        test("the big int type matches Big Int values", () => {
            const bigIntType = type("bigint");
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
        })
        test("the function type matches functions", () => {
            const functionType = type("function");
            expect(functionType.checks(()=>0)).toBe(true);
            expect(functionType.checks(function() { return 0; })).toBe(true);
            expect(functionType.checks(function oneWithAName() { return 0; })).toBe(true);
            expect(functionType.checks(1)).toBe(false);
        })
        test("the void type matches null or undefined", () => {
            const voidType = type("void");
            expect(voidType.checks(null)).toBe(true);
            expect(voidType.checks(undefined)).toBe(true);
            expect(voidType.checks(0)).toBe(false);
            expect(voidType.checks("")).toBe(false);
            expect(voidType.checks(NaN)).toBe(false);
        });
        test("the int type matches whole numbers", () => {
            const intType = type("int");
            expect(intType.checks(1)).toBe(true);
            expect(intType.checks(1.1)).toBe(false);
            expect(intType.checks(NaN)).toBe(false);
            expect(intType.checks(Infinity)).toBe(false);
            expect(intType.checks(-Infinity)).toBe(false);
            expect(intType.checks(0)).toBe(true);
            expect(intType.checks(-1)).toBe(true);
            expect(intType.checks(-1.4)).toBe(false);
            expect(intType.checks(null)).toBe(false)
        })
        test("the double type matches double precision floating point numbers", () => {
            const doubleType = type("double");
            expect(doubleType.checks(1)).toBe(false);
            expect(doubleType.checks(1.1)).toBe(true);
            expect(doubleType.checks(NaN)).toBe(true);
            expect(doubleType.checks(Infinity)).toBe(true);
            expect(doubleType.checks(-Infinity)).toBe(true);
            expect(doubleType.checks(0)).toBe(false);
            expect(doubleType.checks(-1)).toBe(false);
            expect(doubleType.checks(-1.4)).toBe(true);
            expect(doubleType.checks(null)).toBe(false)
        })

    });
});
