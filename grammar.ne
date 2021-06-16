@{%
const moo = require('moo');
const lexer = require('./lex');
const ty = require('./types');

%}
@lexer lexer
@builtin "whitespace.ne"

AND ->
    AND _ %And _ NEG {% ([fst, _, _2, _3, snd]) => ty.and(fst, snd) %}
  | AND _ %Or _ NEG {% ([fst, _, _2, _3, snd]) => ty.or(fst, snd) %}
  | AND _ %Minus _ NEG {% ([fst, _, _2, _3, snd]) => ty.minus(fst, snd) %}
  | NEG {% ([fst]) => fst %}

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
