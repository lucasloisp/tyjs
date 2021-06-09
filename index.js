// constructor(typeAsString, ...valFunctions)
// Type.checks(valor) -> boolean
// Type.demand(valor) -> valor | TypeError
// Type.static.classChecker(clase, valFunction)
// Type.classChecker(clase, valFunction)


// NOT REAL:
const type = require('tyjs')


const threeDigitNumberType = type("number & /\d{3}/")
