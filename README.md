# codegen [![build](https://github.com/smikhalevski/codegen/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/codegen/actions/workflows/master.yml)

Language-agnostic codegen utils.

```shell
npm install --save-prod @smikhalevski/codegen
```

# Usage

```ts
import {template as _, compileJsSource} from '@smikhalevski/codegen';

const kebabVar = _.var();
const indexVar = _.var();
const valueVar = _.var();

const functionBlock = _.block`function makeKebab(${valueVar}){${[
  _.assignment(kebabVar, _`""`),

  _`for(let ${indexVar}=0;${indexVar}<${valueVar}.length;${indexVar}++){`,
  _`${kebabVar}+="-"+${valueVar}.charAt(${indexVar});`,
  _`}`,

  _`return ${kebabVar}`,
]}}`;

compileJsSource(functionBlock);
// → 'function makeKebab(a){let b="";for(let c=0;c<a.length;c++){b+="-"+a.charAt(c);}return b}'
```

Codegen can optimize code by inlining assignments and eliminating redundant variable declarations.

```ts
import {template as _, compileJsSource, inlineVarAssignments} from '@smikhalevski/codegen';

const aVar = _.var();
const bVar = _.var();
const cVar = _.var();

const block = _(
    _.assignment(aVar, 3),
    _.assignment(bVar, 2),
    _.assignment(cVar, _`${aVar}+${bVar}`),

    _`console.log(${cVar})`,
);

// This operation mutates block
inlineVarAssignments(block);

compileJsSource(block);
// → 'console.log(3+2)'
```
