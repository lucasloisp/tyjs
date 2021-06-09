const moo = require("moo");

module.exports = moo.compile({
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
});
