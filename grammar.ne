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
LITERAL ->
    %StringLiteral {% ([v]) => ty.valueType(v.value.slice(1 ,-1)) %}
  | %BooleanLiteral {% ([v]) => ty.valueType(v == "true") %}
  | %ArrayOfLiteral {% ([v]) => ty.arrayOfValuesType(JSON.parse(v.value.slice(2))) %}
  | %SpecialNumber {% ([v]) => ty.valueType(parseFloat(v)) %}
  | %Hexadecimal {% ([v]) => ty.valueType(parseInt(v)) %}
  | %NumberLiteral {% ([v]) => ty.valueType(parseFloat(v)) %}
  | %RegexLiteral {% ([v]) => ty.regexType(new RegExp(v.value.slice(1,-1))) %}
SEQUENCE ->
    %LeftSquareBracket _ %Decomposition ATOMIC _ %RightSquareBracket {% ([lsb, _, dcp, v]) => ty.sequenceType(v) %}
  | %LeftSquareBracket _ %Decomposition _ %RightSquareBracket {% () =>  ty.sequenceType(ty.anyType()) %}
  | %LeftSquareBracket _ (ATOMIC %Comma _ {% ([v]) => ty.singleSeq(v) %}):* ATOMIC _ %RightSquareBracket {% ([lsb, _, tail, head]) => ty.sequenceType([...tail, ty.singleSeq(head)]) %}
ATOMIC ->
    %Undefined {% () => ty.undefinedType() %}
  | SEQUENCE {% ([v]) => v %}
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
  | LITERAL {% ([v]) => v %}
  | %LeftPar _ AND _ %RightPar {% ([_, _2, fst]) => fst %}
