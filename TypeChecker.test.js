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
        test("the sybmol type matches all symbols", () => {
            const symbolType = type("symbol");
            expect(symbolType.checks(Symbol())).toBe(true);
            expect(symbolType.checks(Symbol("hello"))).toBe(true);
            expect(symbolType.checks("hello")).toBe(false);
        })

    });
});
