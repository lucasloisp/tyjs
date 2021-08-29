# TyJS

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
- `any`, matching any value at all.
- `symbol` (for any JS `Symbol` value).
- literal values too, like `17`, `true` or `"hello"` (with quotations), match
  themselves.

Literal values are also possible to match against by defining a set of possible
values, with the following syntax:

```js
in [0]
in [false, 17, "hello"]
```

The values inside the array can be any imaginable, as it is parsed as a JSON
array.

Finally, regular expressions can be used to match any value whose string
representation matches that expression.

### Sequences

A sequence can be typed in several ways.

- `[ ...number ]` defines sequence of 0-or-more values of type `number`.
- `[ ... ]` defines sequence of 0-or-more values of any type.
- `[ ...3 * number ]` defines sequence of 3 numbers, i.e. a triple.
- `[ number, ...3 * byte ]` defines sequence of a number followed by 3 bytes.
- `[ number, ...3 * byte ]` defines sequence of a number followed by 3 bytes.
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

Regexes can be used to describe the name of a property, but again, only one
matching property is allowed.

- `{ /na+/: string, age: number }` would match `{ na: "Alice", age: 44}`.
- But not `{ na: "Alice", age: 44, naa: "Bob" }`.
- `{ .../na+/: string, age: number }` will match 0+ number of `na+` properties.
- `{ ...3 * /na+/: string, age: number }` will match objects with exactly 3
  properties matching the regex.

### Operators

The following operators on the base types are defined to add expressivity to type
definitions.

- `!type`, allows for matching any value that does **not** match `type`.
- `type & type`, allows for matching any value that matches both types.
- `type | type`, allows for matching any value that matches either type.
- `type - type`, allows for matching any value that matches the first type
  without matching the second.
- `type || type`, allows for matching any value that matches either type.
- `type || type`, allows for matching any value that matches either type.

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
new Map([["one", 1]]) : Set<number>
```

### Generics on your own types

Coming soon.

<!-- TODO -->

### Checker functions

Coming soon.

<!-- TODO -->

## Developer Setup

1. `npm run grammar` to generate the grammar parser.
2. `npm run test` to execute the test suite.
3. This module can be utilized from another project by importing it as such:

```js
const { Type, type } = require("tyjs");

const naturals = type`int & ${(v) => v >= 0}`;

const threeDigit = new Type("number & /\\d{3}/");
```

4. Have fun!
