const ty = require('./types.js')

describe("the types in TyJS", () => {
    describe("the atomic types", () => {
        test("the undefined type", () => {
            expect(ty.undefinedType()).toEqual({type: 'undefined'});
        });
        test("the boolean type", () => {
            expect(ty.booleanType()).toEqual({type: 'boolean'});
        });
        test("the number type", () => {
            expect(ty.numberType()).toEqual({type: 'number'});
        });
        test("the string type", () => {
            expect(ty.stringType()).toEqual({type: 'string'});
        });
        test("the function type", () => {
            expect(ty.functionType()).toEqual({type: 'function'});
        });
        test("the symbol type", () => {
            expect(ty.symbolType()).toEqual({type: 'symbol'});
        });
        test("the object type", () => {
            expect(ty.objectType()).toEqual({type: 'object'});
        });
        test("the bigint type", () => {
            expect(ty.bigintType()).toEqual({type: 'bigint'});
        });
    });
});
