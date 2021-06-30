const { type } = require("./index.js");

describe("the tyjs library", () => {
  describe("checking for types", () => {
    test("a three digit number type", () => {
      const threeDigitNumberType = type`number & /\\d{3}/`;
      for (let i = 100; i < 1000; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(true);
      }
      for (let i = 0; i < 100; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(false);
      }
    });
  });
  describe("checking for a new class", () => {
    test("my own person type", () => {
      class Student {
        constructor(name, id, grade) {
          this.name = name;
          this.id = id;
          this.grade = grade;
        }
      }
      const studentType = type`Student<string>`;
      studentType.classChecker(Student, (studentValue, args) => {
        const [gradeType] = args;
        return args.length === 1 && gradeType(studentValue.grade);
      });
      let alice = new Student("Alice", "123", "A");
      expect(studentType.checks(alice)).toBe(true);
      let bob = new Student("Bob", "1234", 123);
      expect(studentType.checks(bob)).toBe(false);
    });
  });
  test("a tagged union type with classes and generics", () => {
    class Box {
      constructor(value) {
        this.value = value;
      }
    }
    class FixedLengthArray {
      constructor(values) {
        this.values = values;
      }
    }
    const numberType = type`["boxed", Box<number | FixedLengthArray<4>>] | ["unboxed", number]`;
    numberType.classChecker(Box, (box, args) => {
      const [valueType] = args;
      return args.length === 1 && valueType(box.value);
    });
    numberType.classChecker(FixedLengthArray, (fixedArr, args) => {
      const [lengthType] = args;
      return (
        args.length === 1 &&
        fixedArr.values instanceof Array &&
        lengthType(fixedArr.values.length)
      );
    });
    let boxed1 = new Box(1);
    let unboxed2 = 2;
    let boxedArray = new Box(new FixedLengthArray([1, 2, 3, 4]));
    let boxedArrayWrongLength = new Box(new FixedLengthArray([1, 2, 3]));
    expect(numberType.checks(boxed1)).toBe(false);
    expect(numberType.checks(unboxed2)).toBe(false);
    expect(numberType.checks(boxedArray)).toBe(false);
    expect(numberType.checks(boxedArrayWrongLength)).toBe(false);
    expect(numberType.checks(["boxed", boxed1])).toBe(true);
    expect(numberType.checks(["unboxed", unboxed2])).toBe(true);
    expect(numberType.checks(["boxed", boxedArray])).toBe(true);
    expect(numberType.checks(["boxed", boxedArrayWrongLength])).toBe(false);
    expect(numberType.checks(["unboxed", boxed1])).toBe(false);
    expect(numberType.checks(["boxed", unboxed2])).toBe(false);
  });
});
