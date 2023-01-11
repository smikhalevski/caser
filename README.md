# codedegen [![build](https://github.com/smikhalevski/codedegen/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/codegen/actions/workflows/master.yml)

Fast and simple JS/TS code generator.

```shell
npm install --save-prod codedegen
```

# Overview

🔎 [API documentation is available here.](https://smikhalevski.github.io/codedegen/)

The code is represented via arrays nested at arbitrary depth:

```ts
import { Code, assembleJs } from 'codedegen';

const code: Code = ['console.log(', ['"Hello"'], ')'];

assembleJs(code);
// ⮕ 'console.log("Hello")'
```

You can use primitives as values:

```ts
const code: Code = [1, '+', 2];

assembleJs(code);
// ⮕ '1+2'
```

Symbols represent variables:

```ts
const varA = Symbol();
const varB = Symbol();

const code: Code = [
  'if(', varA, '!==0){',
  'return ', varA, '*', varB,
  '}'
]

assembleJs(code);
// ⮕ 'if(a!==0){return a*b}'
```

## Compiling a function

You can compile a function directly from the code template:

```ts
import { compileFunction } from 'codedegen';

const arg = Symbol();
const varA = Symbol();
const varB = Symbol();

const fn = compileFunction(
  // The list of function arguments
  [arg],

  // The function body
  [
    'var ', varA, '=123;',
    'return ', varA, '+', arg, '+', varB, '.fooBar',
  ],

  // The optional list of variable bindings
  [[varB, { fooBar: 456 }]],
);

fn(789);
// ⮕ '1368'
```

## Naming variables

If you want a specific variable to have a specific name, you can pass a `VarRenamer` to `assembleJs`:

```ts
import { assembleJs, createVarRenamer } from 'codedegen';

const varA = Symbol();
const varB = Symbol();

const varRenamer = createVarRenamer([[varA, 'X']]);

assembleJs([varA, '===', varB], varRenamer);
// ⮕ 'X===a'
```

`VarRenamer` instance always return the same name for the same variable:

```ts
varRenamer(varA);
// ⮕ 'X'
```

You can provide a name encoder to `createVarRenamer` that converts variable index into a valid JS identifier.

```ts
import { assembleJs, createVarRenamer } from 'codedegen';

const varRenamer = createVarRenamer([], index => '_' + index);

assembleJs([Symbol(), '>', Symbol()], varRenamer);
// ⮕ '_0>_1'
```

# DSL

To ease the codegen there's a set of DSL functions which you can use anywhere in your templates.

### `propAccess`

Returns a prop accessor code:

```ts
propAccess('obj', 'foo');
// ⮕ 'obj.foo'

propAccess('obj', 9);
// ⮕ 'obj[9]'

propAccess('obj', 'foo bar', true);
// ⮕ 'obj?.["foo bar"]'
```

You can generate a nested property access code like this:

```ts
import { assembleJs, propAcccess } from 'codedegen';

const varA = Symbol();
const varB = Symbol();

assembleJs([
  varA, '=', propAcccess(propAccess(varB, 'fooBar', true), 10)
]);
// ⮕ 'a=b?.fooBar[10]'
```

### `objectKey`

Returns the code of an object key:

```ts
objectKey('foo bar');
// ⮕ '"foo bar"'

objectKey('fooBar');
// ⮕ 'fooBar'

objectKey('0');
// ⮕ '0'

objectKey('0123');
// ⮕ '"0123"'
```

For example, to create an object you can:

```ts
import { assembleJs, Code, objectKey } from 'codedegen';

assembleJs([
  '{',
  objectKey('fooBar'), ':123,',
  objectKey('Yes Sir!'), ':456,',
  '}',
]);
// ⮕ '{fooBar:123,"Yes Sir!":456,}'
```

### `comment` and `docComment`

Return a code of a comment block:

```ts
import { assembleJs } from 'codedegen';

assembleJs(docComment('Yes Sir,\nI Can Boogie'));
```

### `varAssign`

Returns a variable assignment code:

```ts
const varA = Symbol();
const varB = Symbol();

varAssign(varA, [varB]); // ⮕ 'a=b;'

varAssign(varA, [propAccess(varB, 'fooBar'), '/2']);
// ⮕ 'a=b.fooBar/2'
```

### `varDeclare`

Returns a variable declaration code:

```ts
const varA = Symbol();

varDeclare(varA);
// ⮕ 'var a;'

varDeclare(varA, [123]);
// ⮕ 'var a=123;'
```
