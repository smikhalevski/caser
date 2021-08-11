import {compileJsSource, inlineVarAssignments, template as _} from '../main';

describe('readme', () => {

  test('usage example', () => {

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

    expect(compileJsSource(functionBlock)).toBe(
        'function makeKebab(a){'
        + 'let b="";'
        + 'for(let c=0;c<a.length;c++){'
        + 'b+="-"+a.charAt(c);'
        + '}'
        + 'return b'
        + '}');
  });

  test('assignment inlining', () => {

    const aVar = _.var();
    const bVar = _.var();
    const cVar = _.var();

    const block = _(
        _.assignment(aVar, 3),
        _.assignment(bVar, 2),
        _.assignment(cVar, _`${aVar}+${bVar}`),

        _`console.log(${cVar})`,
    );

    inlineVarAssignments(block);

    expect(compileJsSource(block)).toBe('console.log(3+2)');
  });

});
