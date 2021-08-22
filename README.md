# TyJS

A runtime type-checker creation utility developed as part of our coursework in
learning about formal languages.

## Use Case

This module allows the definition of runtime type-checkers for you javascript
project.
For some example usages, check out the `index.test.js` file.

## Developer Setup

1. `npm run grammar` to generate the grammar parser.
2. `npm run test` to execute the test suite.
3. This module can be utilized from another project by importing it as such:

```javascript
const { Type, type } = require("tyjs");

const naturals = type`int & ${(v) => v >= 0}`;

const threeDigit = new Type("number & /\\d{3}/");
```

4. Have fun!
