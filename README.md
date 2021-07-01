# TyJS

## Cómo usar

1. `npm run grammar` para generar la gramática.
2. `npm run test` para ejecutar la suite de tests.
3. Se puede utilizar desde otro módulo npm instalando este como dependencia e
   importando como:

```javascript
const { Type, type } = require('tyjs');


const naturals = type`int & ${v => v >= 0}`

const threeDigit = new Type("number & /\\d{3}/");
```


## Cambio en definición de funciones $n

Las funciones $n, para mantener la lógica de los operators y cumplir con la
firmas de `classChecker`, se redefine de la siguiente manera: Son funciones que
reciben un valor y retornan _true_ si el chequeo es exitoso y _false_ en caso
contrario.
