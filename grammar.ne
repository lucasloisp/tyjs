@{%
const moo = require('moo');
const lexer = require('./lex');
const ty = require('./types');

%}
@lexer lexer
NEG ->
    %Not NEG {% ([_, snd]) => ty.not(snd) %}
  | ATOMIC {% ([fst]) => fst %}
ATOMIC ->
    %Undefined {% () => ty.undefinedType() %}
  | %Boolean {% () => ty.booleanType() %}
  | %Number {% () => ty.numberType() %}
  | %String {% () => ty.stringType() %}
  | %Function {% () => ty.functionType() %}
  | %Symbol {% () => ty.symbolType() %}
  | %Object {% () => ty.objectType() %}
  | %BigInt {% () => ty.bigintType() %}
  | %Void {% () => ty.voidType() %}
  | %Int {% () => ty.intType() %}
  | %Double {% () => ty.doubleType() %}
  | %Char {% () => ty.charType() %}
  | %Byte {% () => ty.byteType() %}
  | %Any {% () => ty.anyType() %}
