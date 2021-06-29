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
  %Property _ %Colon _ ATOMIC {% ([p, _, _2, _3 , v]) => ([p.value,v]) %}
  | %RegexLiteral _ %Colon _ ATOMIC {% ([r, _, _2, _3 , v]) => ([new RegExp(r.value.slice(1,-1)),v]) %}  
  | %Decomposition %RegexLiteral _ %Colon _ ATOMIC {% ([_, r, _2, _3, _4 , v]) => ([new RegExp(r.value.slice(1,-1)),v,"many"]) %}

SEQUENCE ->
    %LeftSquareBracket
    _
    (ATOMIC %Comma _ {% ([v]) => ty.singleSeq(v) %} | %Decomposition ATOMIC %Comma _ {% ([_, v]) => v %}):*
    (ATOMIC _ {% ([v]) => ty.singleSeq(v) %}
     | %Decomposition ATOMIC {% ([_, v]) => v %}
     | %Decomposition {% () =>  ty.anyType() %})
    _
    %RightSquareBracket
    {% ([lsb, _, tail, head]) => ty.sequenceType([...tail, head]) %}
ATOMIC ->
    %Undefined {% () => ty.undefinedType() %}
  | OBJECT {% ([v]) => v %}
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
