@{%
const moo = require('moo');
const lexer = require('./lex');
const ty = require('./types');

%}
@lexer lexer
@builtin "whitespace.ne"
MINUS ->
    MINUS _ %Minus _ OR {% ([fst, _, _2, _3, snd]) => ty.minus(fst, snd) %}
  | OR  {% id %}

OR ->
    OR _ %Or _ AND {% ([fst, _, _2, _3, snd]) => ty.or(fst, snd) %}
  | AND {% id %}

AND ->
    AND _ %And _ NEG {% ([fst, _, _2, _3, snd]) => ty.and(fst, snd) %}
  | NEG {% id %}

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

OBJECT ->
    %LeftCurlyBracket
    _
    (KEYVALUEPAIR %Comma _ {% id %} ):*
    (KEYVALUEPAIR _ {% id %} | %Decomposition {% () => 'any' %})
    _
    %RightCurlyBracket
    {% ([lcb, _, tail, head]) => {
      const flag = head === 'any';
      return ty.objectsType([...tail, ...(flag ? [] : [head] ) ] , flag); }
    %}

KEYVALUEPAIR ->
  %Property  _ ATOMIC {% ([p, _ , v]) => ([p.value.slice(0,-1),v]) %}
  | %RegexLiteral _ %Colon _ ATOMIC {% ([r, _, _2, _3 , v]) => ([new RegExp(r.value.slice(1,-1)),v]) %}
  | %Decomposition %RegexLiteral _ %Colon _ ATOMIC {% ([_, r, _2, _3, _4 , v]) => ([new RegExp(r.value.slice(1,-1)),v,"many"]) %}
  | %Decomposition %IntegerLiteral _ %RegexLiteral _ %Colon _ ATOMIC {% ([_, il, _2, r, _4 , _5, _6, v]) => ([new RegExp(r.value.slice(1,-1)),v,parseInt(il.value)]) %}

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
  | OBJECT {% id %}
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
  | %LeftPar _ MINUS _ %RightPar {% ([_, _2, fst]) => fst %}
  | %Class %Lt (MINUS %Comma _ {% id %}):* MINUS %Gt
    {% ([cls, _, tail, head]) => ty.classType(cls.value, [...tail, head]) %}
  | %Class {% ([fst]) => ty.classType(fst.value) %}
  | %CustomFnChecker {% ([fst]) => ty.checkFunctionType(parseInt(fst.value.slice(1))) %}
