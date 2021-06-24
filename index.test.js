const type = require("./index.js");

describe("the tyjs library", () => {
  describe("checking for types", () => {
    test("a three digit number type", () => {
      const threeDigitNumberType = type("number & /\\d{3}/");
      for (let i = 100; i < 1000; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(true);
      }
      for (let i = 0; i < 100; i++) {
        expect(threeDigitNumberType.checks(i)).toBe(false);
      }
    });
  });
  describe("checking for a new class", () => {
    test.skip("my own person type", () => {
      class Student {
        constructor(name, id, grade) {
          this.name = name;
          this.id = id;
          this.grade = grade;
        }
      }
      const studentType = type("Student<string>");
      studentType.classChecker(Student, (studentValue, args) => {
        const [gradeType] = args;
        return args.length === 1 && gradeType(studentValue.grade);
      });
      expect(studentType.checks(new Student("Agustin", "123", "A"))).toBe(true);
      expect(studentType.checks(new Student("Lucas", "1234", 123))).toBe(false);
    });
  });
});
