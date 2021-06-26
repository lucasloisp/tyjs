// noinspection RegExpRedundantEscape

const moo = require("moo");

module.exports = moo.compile({
  StringLiteral: /"(?:\\["\\]|[^\n"\\])*"/,
  Decomposition: ["..."],
  LeftSquareBracket: ["["],
  RightSquareBracket: ["]"],
  Not: ["!"],
  And: ["&"],
  ArrayOfLiteral: /in \[.*\]/,
  Or: ["|"],
  SpecialNumber: ["Infinity", "NaN", "-Infinity", "+Infinity"],
  Hexadecimal: /[-+]?0x[a-fA-F\d]+/,
  NumberLiteral:
    /[-+]?(?:(?:(?:\d+\.\d*)|(?:\d*\.?\d+))(?:e[+-]?\d+)?)|[-+]?\d+/,
  RegexLiteral: /\/.*\//,
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
