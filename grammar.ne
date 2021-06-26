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
SEQUENCEELEMENT ->
    ATOMIC {% ([v]) => ty.singleSeq(v) %}
  | %Decomposition ATOMIC {% ([_, v]) => v %}
  | %Decomposition %IntegerLiteral _ ATOMIC
    {% ([_, sqc, _1, v]) => ty.times(v, parseInt(sqc.value)) %}
SEQUENCE ->
    %LeftSquareBracket
    _
    (SEQUENCEELEMENT %Comma _ {% id %}):*
    (SEQUENCEELEMENT {% id %}
     | %Decomposition {% () =>  ty.anyType() %})
    _
    %RightSquareBracket
    {% ([lsb, _, tail, head]) => ty.sequenceType([...tail, head]) %}
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
  | %Class %Lt (AND %Comma _ {% id %}):* AND %Gt
    {% ([cls, _, tail, head]) => ty.classType(cls.value, [...tail, head]) %}
  | %Class {% ([fst]) => ty.classType(fst.value) %}
