const moo = require("moo");

module.exports = moo.compile({
  Not: ["!"],
  And: ["&"],
  Or: ["|"],
  SpecialNumber: ["Infinity", "NaN", "-Infinity", "+Infinity"],
  Hexadecimal: /[-+]?0x[a-fA-F\d]+/,
  NumberLiteral:
    /[-+]?(?:(?:(?:\d+\.\d*)|(?:\d*\.?\d+))(?:e[+-]?\d+)?)|[-+]?\d+/,
  Minus: ["-"],
  LeftPar: ["("],
  RightPar: [")"],
  Undefined: ["undefined"],
  Boolean: ["boolean"],
  Number: ["number"],
  String: ["string"],
  Function: ["function"],
  Symbol: ["symbol"],
  Object: ["object"],
  BigInt: ["bigint"],
  Void: ["void"],
  Int: ["int"],
  Double: ["double"],
  Char: ["char"],
  Byte: ["byte"],
  Any: ["any", "_"],
  Whitespace: [" "],
  BooleanLiteral: /true|false/,
});
