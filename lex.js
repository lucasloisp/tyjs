// noinspection RegExpRedundantEscape

const moo = require("moo");

module.exports = moo.compile({
  StringLiteral: /"(?:\\["\\]|[^\n"\\])*"/,
  Decomposition: ["..."],
  LeftCurlyBracket: ["{"],
  Colon: [":"],
  LeftCurlyBracket: ["{"],
  RightCurlyBracket: ["}"],
  LeftSquareBracket: ["["],
  RightSquareBracket: ["]"],
  Comma: [","],
  Not: ["!"],
  And: ["&"],
  ArrayOfLiteral: /in \[.*\]/,
  Or: ["|"],
  SpecialNumber: ["Infinity", "NaN", "-Infinity", "+Infinity"],
  Hexadecimal: /[-+]?0x[a-fA-F\d]+/,
  IntegerLiteral: /\d+ \*/,
  NumberLiteral:
    /[-+]?(?:(?:(?:\d+\.\d*)|(?:\d*\.?\d+))(?:e[+-]?\d+)?)|[-+]?\d+/,
  RegexLiteral: /\/(?:[^/]|\\\/)*\//,
  Minus: ["-"],
  LeftPar: ["("],
  RightPar: [")"],
  Gt: [">"],
  Lt: ["<"],
  Undefined: ["undefined"],
  Boolean: ["boolean"],
  Number: ["number"],
  String: ["string"],
  Function: ["function"],
  Symbol: ["symbol"],
  Object: ["object"],
  BigInt: ["bigint"],
  Void: ["void"],
  Null: ["null"],
  Int: ["int"],
  Double: ["double"],
  Char: ["char"],
  Byte: ["byte"],
  Any: ["any", "_"],
  Whitespace: [" "],
  BooleanLiteral: /true|false/,
  Property: /[A-Za-z0-9_]+:/,
  Class: /[A-Z]\w*/,
  CustomFnChecker: /\$\d+/,
});
