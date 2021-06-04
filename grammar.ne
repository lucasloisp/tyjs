@{%
const moo = require('moo');
const lexer = require('./lex');
const functions = require('./functions');

%}
@lexer lexer
I ->
    %If C %Then I %Else I {% ([_, cond, _2, then, _3, otherwise]) => cond ? then : otherwise %}
  | C {% ([fst]) => fst %}
C ->
    E  {% ([fst]) => fst %}
  | E %Equal E {% ([fst, _, snd]) => fst == snd %}
  | E %Diff E {% ([fst, _, snd]) => fst != snd %}
  | E %GTE E {% ([fst, _, snd]) => fst >= snd %}
  | E %GT E {% ([fst, _, snd]) => fst > snd %}
  | E %LT E {% ([fst, _, snd]) => fst < snd %}
  | E %LTE E {% ([fst, _, snd]) => fst <= snd %}
  | E %And E {% ([fst, _, snd]) => fst && snd %}
  | E %Or E {% ([fst, _, snd]) => fst || snd %}

E ->
    T {% ([fst]) => fst %}
  | E %Add T {% ([fst, _, snd]) => fst + snd %}
  | E %Sub T {% ([fst, _, snd]) => fst - snd %}
T ->
    N {% ([fst]) => fst %}
  | T %Mult N {% ([fst, _, snd]) => fst * snd %}
  | T %Div N {% ([fst, _, snd]) => fst / snd %}
  | T %ZDiv N {% ([fst, _, snd]) => Math.floor(fst / snd) %}
  | T %Mod N {% ([fst, _, snd]) => fst % snd %}
N ->
    %Number {% ([fst]) => +fst %}
  | %True {% ([_]) => true %}
  | %False {% ([_]) => false %}
  | %Sub N {% ([fst, snd]) => -snd %}
  | %ParOpen I %ParClose {% ([_, fst, _2]) => fst %}
  | %Not N {% ([_, snd]) => !snd %}
  | %Identifier %ParOpen ARG %ParClose {% ([f, _, n, _2]) => functions.get(f.value)(...n) %}
  | %Identifier %ParOpen %ParClose {% ([f, _, _2]) => functions.get(f.value)() %}
ARG ->
    I {% ([fst]) => [fst] %}
  | ARG %Comma I {% ([fst, _, snd]) => fst.concat(snd) %}
