<h1 align="center">
  <img src="https://raw.githubusercontent.com/lucasloisp/tyjs/main/icons/tyjs.png" alt="TyJS" width="256" height="256"/><br>
  TyJS
  <!-- tyjs color: #d43359 -->
  <!-- ts color: #3178c6 -->
  <!-- js color: #f7df1e -->
</h1>

<p align="center"><em>(pronounced "tie JS")</em></p>

A runtime-type-checker creation utility developed as part of our coursework in
learning about formal languages.

## Use Case

This module allows the definition of runtime type-checkers for you javascript
project.
For some example usages, check out the `index.test.js` file.

To write up a type of your own, just use the `type` tagged template literal.

```js
type`string | null`;
type`number & /\\d{3}/`;
type`{ tag: 'yes', value: number } | { tag: 'no' }`;
```

## Defining Types

The following primitive types are supported out of the box.

- `undefined` (just the `undefined` value).
- `boolean`.
- `number`.
- `function`.
- `bigint` (for [`BigInt` values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt))
- `void`, which matches the `null` or `undefined` values.
- `null`, which matches the `null` value only.
- `int`, which matches whole numbers.
- `double`, which matches numbers, that are **not** `int`.
- `char`, will match any single-character string.
- `byte`, will match whole numbers from 0 to 255.
- `any` (or `_`), matching any value at all.
- `symbol` (for any JS `Symbol` value).
- literal values too, like `17`, `true` or `"hello"` (with quotations), match
  themselves.

Literal values are also possible to match against by defining a set of possible
values, with the following syntax:

```js
in [0]
in [false, 17, "hello"]
```

The values inside the array can be any JSON-valid value.

Finally, regular expressions can be used to match any value whose string
representation matches that expression.

### Sequences

A sequence can be typed in several ways.

- `[ ...number ]` defines a sequence of 0+ values of type `number`.
- `[ ...3 * number ]` defines a sequence of 3 numbers, i.e. a triple.
- `[ number, ...3 * byte ]` defines a sequence of a number followed by 3 bytes.
- `[ ... ]` defines sequence of 0+ values of any type.
- Note that the sequence of `any`s can only go last (i.e. `[ ..., number ]` is
  an invalid type).

Any value that complies with the iterator protocol is a sequence.
Most notable examples are:

- Lists like `[1, 2, 3]` and `["hello", "world"]`.
- Strings are sequences of characters.
- Sets are sequences with insertion-order.
- Maps and objects too, being sequences of key-value pairs.

### Objects

Object have similar ways of being defined.

- `{ name: string, age: number }` is a simple object with exactly two
  properties, typed as such.
- `{ name: string, age: number, ... }` has two required properties but can
  contain any other number of additional ones, typed at will.

Regular Expressions can be used to describe the name of a property, but again,
only one matching property is allowed by default.

- `{ /na+/: string, age: number }` would match `{ na: "Alice", age: 44}`.
- But not `{ na: "Alice", age: 44, naa: "Bob" }`.
- `{ .../na+/: string, age: number }` will match 0+ number of `na+` properties.
- `{ ...3 * /na+/: string, age: number }` will match objects with exactly 3
  properties matching the regex.

### Operators

The following operators on the base types are defined to add expressivity to
type definitions.

- `!type`, allows for any value that does **not** match `type`.
- `type & type`, allows for any value that matches both types.
- `type | type`, allows for any value that matches either type.
- `type - type`, allows for any value that matches the first type
  without matching the second.

### Custom Classes

Classes (both defined by the user or built-in, like `Array`) can be used in type
definitions, referenced by name.

```js
new Date() : Date
new CustomClass(arg1, arg2) : CustomClass
```

Generics are supported for some of the built in classes, with the following
syntax:

```js
["hello", "world"]    : Array<string>
new Set([1, 2, 3])    : Set<number>
new Map([["one", 1]]) : Map<string, number>
```

### Generics on your own types

For custom types (or types other than `Array`, `Set` or `Map`) you can define
your own criteria for generics by defining a "class checker".

```js
const numberBox = type`Box<number>`;
numberBox.classChecker(
  Box,
  (box, args) => args.length === 1 && args[0](box.value)
);
```

These require the class constructor (i.e. `Box`) and a function that receives

1. a value of that type (`Box`)
2. and the `args` array, which has a checker function for each of the generic
   types.

A box has only one type parameter that makes sense, the value contained in the
box.
Maps have two (key and value).
For this reason it is common to check that `args.length` matches what you
expect.

```js
const person = type`Person<string, number>`;
person.classChecker(
  Person,
  (person, args) =>
    args.length === 2 && args[0](person.name) && args[1](person.age)
);
```

### Checker functions

For any other criteria you might have (value ranges, a type depending on the
context, ...), you should use checker functions.

By using class literals, you write these out by interpolating unary functions in
place of some `type` that return a boolean.

```js
const nonNegativeNumber = type`number & ${(v) => v >= 0}`;
const even = type`number & ${(v) => v % 2 == 0}`;
const now = new Date();
const epochAfterNow = type`number & ${(v) => v > now.getTime()}`;
```

## Developer Setup

1. `npm run grammar` to generate the grammar parser.
2. `npm run test` to execute the test suite.
3. This module can be utilized from another project by importing it as such:

```js
const { type } = require("tyjs-check");

const naturals = type`int & ${(v) => v >= 0}`;

const threeDigit = type`number & /\\d{3}/`;
```

4. Have fun!
