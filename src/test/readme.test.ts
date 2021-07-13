import _, {compileTsSource} from '../main';

describe('readme', () => {

  test('readme example', () => {

    const kebabVar = _.var();
    const indexVar = _.var();
    const valueVar = _.var();

    const functionBlock = _.block`function makeKebab(${valueVar}){${_(
        _`let ${kebabVar}="";`,
        _`for(let ${indexVar}=0;${indexVar}<${valueVar}.length;${indexVar}++){`,
        _`${kebabVar}+="-"+${valueVar}.charAt(${indexVar});`,
        _`}return ${kebabVar}`,
    )}}`;

    expect(compileTsSource(functionBlock)).toBe('function makeKebab(a){let b="";for(let c=0;c<a.length;c++){b+="-"+a.charAt(c);}return b}');
  });
});
