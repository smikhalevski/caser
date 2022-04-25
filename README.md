# LeCodeDegen [![build](https://github.com/smikhalevski/codedegen/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/codegen/actions/workflows/master.yml)

Fast and simple JS/TS codegen.

```shell
npm install --save-prod codedegen
```

# Usage

⚠️ [API documentation is available here.](https://smikhalevski.github.io/codedegen/)

```ts
import {compileFunction} from 'codedegen';

const myArg = Symbol();
const myVar = Symbol();
const myBoundVar = Symbol();

const myFn = compileFunction(
    [myArg],
    [
      'var ', myVar, '= 123;',
      'return ', myVar, '+', myArg, '+', myBoundVar,
    ],
    [[myBoundVar, 456]],
);

myFn(789); // → 1368
```
