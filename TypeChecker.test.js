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
      expect(charType.checks("????")).toBe(false);
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
    test("it works with parsing single-value types", () => {
      const theSeventeenType = new Type("17 | string");
      expect(theSeventeenType.checks(17)).toBe(true);
      expect(theSeventeenType.checks(0)).toBe(false);
      expect(theSeventeenType.checks("17")).toBe(true);
      expect(theSeventeenType.checks("19")).toBe(true);
    });
  });
  describe("the in value types", () => {
    test("it works with parsing single-value list", () => {
      const theSeventeenType = new Type("in [17]");
      expect(theSeventeenType.checks(17)).toBe(true);
      expect(theSeventeenType.checks(0)).toBe(false);
      expect(theSeventeenType.checks("17")).toBe(false);
    });
    test("it works with parsing two-value list", () => {
      const twoNumbers = new Type("in [17, 18]");
      expect(twoNumbers.checks(17)).toBe(true);
      expect(twoNumbers.checks(18)).toBe(true);
      expect(twoNumbers.checks(0)).toBe(false);
      expect(twoNumbers.checks("17")).toBe(false);
    });
    test("it works with parsing a multiple type-literal list", () => {
      const multiTypeArray = new Type('in [17, false, "hello"]');
      expect(multiTypeArray.checks(17)).toBe(true);
      expect(multiTypeArray.checks(18)).toBe(false);
      expect(multiTypeArray.checks(0)).toBe(false);
      expect(multiTypeArray.checks("17")).toBe(false);
      expect(multiTypeArray.checks(false)).toBe(true);
      expect(multiTypeArray.checks("hello")).toBe(true);
    });
  });
  describe("the regex type", () => {
    test("simple regex for strings", () => {
      const ipAddress = new Type("/\\d{3}\\.\\d{3}\\.\\d{3}\\.\\d{3}/");
      expect(ipAddress.checks("192.168.000.001")).toBe(true);
    });
    test("three digit numbers", () => {
      const threeDigitNumberType = new Type("number & /\\d{3}/");
      for (let i = 100; i < 1000; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(true);
      }
      for (let i = 0; i < 100; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(false);
      }
    });
  });
  describe("the sequence type", () => {
    describe("single type sequences", () => {
      test("a homogeneous number sequence", () => {
        const numberSequence = new Type("[ ...number ]");
        expect(numberSequence.checks([])).toBe(true);
        expect(numberSequence.checks([1])).toBe(true);
        expect(numberSequence.checks(["hello"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("a sequence of any's", () => {
        const numberSequence = new Type("[ ... ]");
        expect(numberSequence.checks([])).toBe(true);
        expect(numberSequence.checks([1])).toBe(true);
        expect(numberSequence.checks(["hello"])).toBe(true);
        expect(numberSequence.checks("hello")).toBe(true);
        expect(numberSequence.checks(1)).toBe(false);
        expect(numberSequence.checks({ name: "Bob" })).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("strings are sequences of characters", () => {
        const numberSequence = new Type("[ ...char ]");
        expect(numberSequence.checks(["a", "b"])).toBe(true);
        expect(numberSequence.checks([1])).toBe(false);
        expect(numberSequence.checks(["hello"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(true);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("objects are sequences", () => {
        const numberSequence = new Type("[ ...[string, number] ]");
        expect(numberSequence.checks({ ["age"]: 3 })).toBe(false);
        expect(numberSequence.checks(new Map([["age", 2]]))).toBe(true);
        expect(
          numberSequence.checks(
            new Map([
              ["age", 2],
              ["grade", 14],
            ])
          )
        ).toBe(true);
        expect(numberSequence.checks(["hello"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sets are sequences, with insertion order", () => {
        const myTriple = new Type("[ number, string, boolean ]");
        const rightOrderSet = new Set();
        rightOrderSet.add(1);
        rightOrderSet.add("hello");
        rightOrderSet.add(true);
        const wrongOrderSet = new Set();
        wrongOrderSet.add(1);
        wrongOrderSet.add(true);
        wrongOrderSet.add("hello");
        const fallShortSet = new Set();
        fallShortSet.add(1);
        fallShortSet.add("hello");
        expect(myTriple.checks(new Set([1, "hello", true]))).toBe(true);
        expect(myTriple.checks(rightOrderSet)).toBe(true);
        expect(myTriple.checks(wrongOrderSet)).toBe(false);
        expect(myTriple.checks(new Set())).toBe(false);
        expect(myTriple.checks(fallShortSet)).toBe(false);
      });
      test("tuples can be typed", () => {
        const numberSequence = new Type("[ string, bigint, number ]");
        expect(numberSequence.checks(["hello", 1n, 1])).toBe(true);
        expect(numberSequence.checks(["hello", 1n])).toBe(false);
        expect(numberSequence.checks(["hello"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of multiple or single types", () => {
        const numberSequence = new Type("[ ...string, number ]");
        expect(numberSequence.checks(["hello", 1])).toBe(true);
        expect(numberSequence.checks(["hello", "goodbye", 1])).toBe(true);
        expect(numberSequence.checks([1])).toBe(true);
        expect(numberSequence.checks(["hello"])).toBe(false);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of 1+ elements", () => {
        const numberSequence = new Type("[ number, ...number ]");
        expect(numberSequence.checks([1])).toBe(true);
        expect(numberSequence.checks([1, 2])).toBe(true);
        expect(numberSequence.checks([1, 2, 3])).toBe(true);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of many, single, and many", () => {
        const numberSequence = new Type("[ ...string, number, ...string ]");
        expect(numberSequence.checks([1])).toBe(true);
        expect(numberSequence.checks([4])).toBe(true);
        expect(numberSequence.checks([1, "hello"])).toBe(true);
        expect(numberSequence.checks(["hello", 1])).toBe(true);
        expect(numberSequence.checks(["hello", 1, "goodbye"])).toBe(true);
        expect(numberSequence.checks(["hello", "world", 1, "goodbye"])).toBe(
          true
        );
        expect(numberSequence.checks([1, 2, 3])).toBe(false);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of many a literal", () => {
        const numberSequence = new Type("[ ...4 ]");
        expect(numberSequence.checks([])).toBe(true);
        expect(numberSequence.checks([4])).toBe(true);
        expect(numberSequence.checks([4, 4])).toBe(true);
        expect(numberSequence.checks([1, "hello"])).toBe(false);
        expect(numberSequence.checks([1, 2, 3])).toBe(false);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of a type and then many anys", () => {
        const numberSequence = new Type("[ number, ...]");
        expect(numberSequence.checks([4])).toBe(true);
        expect(numberSequence.checks([4, 4])).toBe(true);
        expect(numberSequence.checks([1, "hello"])).toBe(true);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks([1, 2, 3])).toBe(true);
        expect(numberSequence.checks([1, "hello", "goodbye"])).toBe(true);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of a given type and then many anys", () => {
        const numberSequence = new Type("[ number, ...]");
        expect(numberSequence.checks([4])).toBe(true);
        expect(numberSequence.checks([4, 4])).toBe(true);
        expect(numberSequence.checks([1, "hello"])).toBe(true);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks([1, 2, 3])).toBe(true);
        expect(numberSequence.checks([1, "hello", "goodbye"])).toBe(true);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of a fixed number of elements of a type", () => {
        const numberSequence = new Type("[ ...3 * number ]");
        expect(numberSequence.checks([4])).toBe(false);
        expect(numberSequence.checks([4, 4])).toBe(false);
        expect(numberSequence.checks([4, 4, 4])).toBe(true);
        expect(numberSequence.checks([])).toBe(false);
        expect(numberSequence.checks([1, 2, 3])).toBe(true);
        expect(numberSequence.checks([1, "hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks(["hello", "goodbye"])).toBe(false);
        expect(numberSequence.checks("hello")).toBe(false);
        expect(numberSequence.checks(null)).toBe(false);
      });
      test("sequences of multiple element types", () => {
        const sequence = new Type("[ string, ...3 * boolean, ...number, ... ]");
        expect(sequence.checks([])).toBe(false);
        expect(sequence.checks(["Alice"])).toBe(false);
        expect(sequence.checks(["Alice", true])).toBe(false);
        expect(sequence.checks(["Alice", true, false])).toBe(false);
        expect(sequence.checks(["Alice", true, false, true])).toBe(true);
        expect(sequence.checks(["Alice", true, false, true, 1, 2])).toBe(true);
        expect(sequence.checks(["Alice", 1, true, false, true, 1])).toBe(false);
        expect(sequence.checks([true, false, true, 1, 2])).toBe(false);
        expect(sequence.checks(["Bob", true, false, true, 1, null])).toBe(true);
        expect(sequence.checks(["Alice", true, false, true, null])).toBe(true);
      });
    });
  });
  describe("the objects type", () => {
    test("testing NORMAL object type", () => {
      const object = new Type("{ name: string, age: number }");
      expect(object.checks({ name: "Esteban", age: 44 })).toBe(true);
      expect(object.checks({ name: "Esteban", age: "44" })).toBe(false);
      expect(object.checks({ name: "Esteban", age: 44, height: 13 })).toBe(
        false
      );
      expect(object.checks("Esteban")).toBe(false);
      expect(object.checks({})).toBe(false);
      expect(object.checks({ age: 44, name: "Esteban" })).toBe(true);
      expect(
        object.checks([
          ["age", 44],
          ["name", "Esteban"],
        ])
      ).toBe(false);
    });
    test("testing decomposition in object", () => {
      const object = new Type("{ name: string, age: number, ... }");
      expect(object.checks({ name: "Carlos", age: 44 })).toBe(true);
      expect(object.checks({ name: "Carlos", age: "44" })).toBe(false);
      expect(
        object.checks({ name: "Carlos", age: 44, height: "1,80", weight: 90 })
      ).toBe(true);
    });
    test("Testing property with name given by regex", () => {
      const object = new Type("{ /na+/: string, age: number }");
      expect(object.checks({ ba: "Carlos", age: 44 })).toBe(false);
      expect(object.checks({ na: "Carlos", age: 44 })).toBe(true);
      expect(object.checks({ naaaaa: "Carlos", age: 44 })).toBe(true);
      expect(object.checks({ naa: "Carlos", age: 44, naaa: "algo" })).toBe(
        false
      );
    });
    test("Test regex is a substring of the prop", () => {
      const object = new Type("{ /na+/: string, age: number }");
      expect(object.checks({ banana: "Carlos", age: 44 })).toBe(true);
    });
    test("Test regex in multiple parameters", () => {
      const object = new Type("{ /na+/: string, /js+/: number }");
      expect(object.checks({ banana: "Carlos", jsjsjs: 44 })).toBe(true);
    });
    test("Test all values have a match", () => {
      const object = new Type("{ /n/: string, /na/: string }");
      expect(object.checks({ banana: "Carlos", jsjsjs: 44 })).toBe(false);
    });
    test("Decomposed Regexes", () => {
      const object = new Type("{ .../n/: string, /ba/: string }");
      expect(
        object.checks({
          negro: "Carlos",
          n: "Esteban",
          numb: "Linkin park",
          ba: "nanasplit",
        })
      ).toBe(true);
      expect(object.checks({ ba: "nanasplit" })).toBe(true);
      expect(
        object.checks({
          negro: "Carlos",
          n: "Esteban",
          numb: "Linkin park",
          ba: "nanasplit",
          oh: "no ohnononono",
        })
      ).toBe(false);
    });
    test("Trying decomposed limited regexes", () => {
      const object = new Type("{ ...3 * /na+/: string, age: number }");
      expect(object.checks({ banana: "Carlos", age: 44 })).toBe(false);
      expect(
        object.checks({
          banana: "Carlos",
          nanana: "Batman",
          nama: "ste",
          age: 44,
        })
      ).toBe(true);
      expect(
        object.checks({
          banana: "Carlos",
          nanana: "Batman",
          nama: "ste",
          nacl: "salt",
          age: 44,
        })
      ).toBe(false);
    });
  });
});
describe("the class type", () => {
  test("basic js class", () => {
    const dateClass = new Type("Date");
    expect(dateClass.checks(new Date())).toBe(true);
    expect(dateClass.checks(BigInt(2))).toBe(false);
    expect(dateClass.checks(2)).toBe(false);
  });
  test("custom js class", () => {
    const customClass = new Type("CustomClass");
    class CustomClass {}
    expect(customClass.checks(new CustomClass())).toBe(true);
    expect(customClass.checks(new Date())).toBe(false);
  });
  test("custom function constructor", () => {
    const customConstructorClass = new Type("CustomConstructor");
    function CustomConstructor() {
      this.test = "Hello";
    }
    expect(customConstructorClass.checks(new CustomConstructor())).toBe(true);
    expect(customConstructorClass.checks(new Date())).toBe(false);
  });
  test("Array class with generic type", () => {
    const arrayOfStringType = new Type("Array<string>");
    expect(arrayOfStringType.checks(["test"])).toBe(true);
    expect(arrayOfStringType.checks(["test", "test2"])).toBe(true);
    expect(arrayOfStringType.checks(["test", 2])).toBe(false);
    expect(arrayOfStringType.checks(4)).toBe(false);
  });
  test("Set class with generic type", () => {
    const setOfStringType = new Type("Set<number>");
    expect(setOfStringType.checks(new Set([1, 2, 1]))).toBe(true);
    expect(setOfStringType.checks(new Set([1, "test", 1]))).toBe(false);
    expect(setOfStringType.checks(["test", "test2"])).toBe(false);
  });
  test("Map class with generic type for key and values", () => {
    const setOfStringType = new Type("Map<string, number>");
    expect(
      setOfStringType.checks(
        new Map([
          ["one", 1],
          ["two", 2],
        ])
      )
    ).toBe(true);
    expect(
      setOfStringType.checks(
        new Map([
          [1, 1],
          ["two", 2],
        ])
      )
    ).toBe(false);
    expect(
      setOfStringType.checks(
        new Map([
          ["one", 1],
          ["two", "2"],
        ])
      )
    ).toBe(false);
    expect(setOfStringType.checks(["test", "test2"])).toBe(false);
  });
  test("generic custom box class", () => {
    class Box {
      constructor(value) {
        this.value = value;
      }
    }
    const numberBox = new Type("Box<number>");
    numberBox.classChecker(Box, (box, args) => {
      return args.length === 1 && args[0](box.value);
    });
    expect(numberBox.checks(new Box(1))).toBe(true);
    expect(numberBox.checks(new Box("hello"))).toBe(false);
    expect(numberBox.checks(1)).toBe(false);
  });
  test("generics on a class without a checker are errors", () => {
    class ClassWithoutChecker {
      constructor() {}
    }
    const numberBox = new Type("ClassWithoutChecker<number>");
    expect(() => numberBox.checks(new ClassWithoutChecker(1))).toThrow(
      "ClassWithoutChecker has no checking for generics"
    );
  });
  test("generics work in an inner type-node", () => {
    class Box {
      constructor(value) {
        this.value = value;
      }
    }
    const numberBox = new Type("Box<number> | number");
    numberBox.classChecker(Box, (box, args) => {
      return args.length === 1 && args[0](box.value);
    });
    expect(numberBox.checks(new Box(1))).toBe(true);
    expect(numberBox.checks(new Box("hello"))).toBe(false);
    expect(numberBox.checks(1)).toBe(true);
    expect(numberBox.checks("hello")).toBe(false);
  });
  test("nested generic types", () => {
    class Box {
      constructor(value) {
        this.value = value;
      }
    }
    const numberBox = new Type("Box<Box<number>>");
    numberBox.classChecker(Box, (box, args) => {
      return args.length === 1 && args[0](box.value);
    });
    expect(numberBox.checks(new Box(new Box(1)))).toBe(true);
    expect(numberBox.checks(new Box(new Box("hello")))).toBe(false);
    expect(numberBox.checks(new Box(1))).toBe(false);
    expect(numberBox.checks(new Box("hello"))).toBe(false);
    expect(numberBox.checks(1)).toBe(false);
    expect(numberBox.checks("hello")).toBe(false);
  });
  describe("Syntax errors", () => {
    test("syntax errors throw", () => {
      expect(() => {
        const myType = new Type("!");
      }).toThrow("Syntax error");
      expect(() => {
        const myType = new Type("!___number");
      }).toThrow("Syntax error");
      expect(() => {
        const myType = new Type("number | | string");
      }).toThrow("Syntax error");
    });
    test("a bogus string does not codify a type", () => {
      expect(() => {
        const numberBox = new Type("This is a bogus string");
      }).toThrow("Syntax error");
    });
  });
  describe("Custom checker functions", () => {
    test("create TypeChecker using one custom checker function", () => {
      const functionStartsWithYes = (value) =>
        typeof value === "string" && value.startsWith("yes");
      const customCheckerType = new Type("$0", [functionStartsWithYes]);
      expect(customCheckerType.checks("yes! it works!")).toBe(true);
      expect(customCheckerType.checks("nope")).toBe(false);
    });
    test("create TypeChecker using two custom checker function", () => {
      const functionStartsWithThis = (value) =>
        typeof value === "string" && value.startsWith("this");
      const functionEndsWithIt = (value) =>
        typeof value === "string" && value.endsWith("it");
      const customCheckerType = new Type("$0 & $1", [
        functionStartsWithThis,
        functionEndsWithIt,
      ]);
      expect(customCheckerType.checks("this is it")).toBe(true);
      expect(customCheckerType.checks("this is not")).toBe(false);
    });
  });
  describe("null type", () => {
    test("matches the literal", () => {
      const nullType = new Type("null");
      expect(nullType.checks(null)).toBe(true);
      expect(nullType.checks(undefined)).toBe(false);
      expect(nullType.checks(true)).toBe(false);
    });
  });
});
