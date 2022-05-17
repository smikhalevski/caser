import {assembleJs, varAssign, varDeclare} from '../main';

describe('assembleJs', () => {

  test('assembles primitives', () => {
    expect(assembleJs(true)).toBe('true');
    expect(assembleJs(false)).toBe('false');
    expect(assembleJs(123)).toBe('123');
    expect(assembleJs('abc')).toBe('abc');
  });

  test('assembles variables', () => {
    const aVar = Symbol();
    const bVar = Symbol();

    expect(assembleJs([aVar, '=', bVar, '+', aVar])).toBe('a=b+a');
  });

  test('assembles var declaration', () => {
    expect(assembleJs(varDeclare(Symbol()))).toBe('var a;');
    expect(assembleJs(varDeclare(Symbol(), undefined))).toBe('var a;');
  });

  test('assembles var declaration with initial value', () => {
    expect(assembleJs(varDeclare(Symbol(), '123'))).toBe('var a=123;');
  });

  test('assembles var assignment', () => {
    expect(assembleJs(varAssign(Symbol(), '123'))).toBe('a=123;');
    expect(assembleJs(varAssign(Symbol(), undefined))).toBe('a=undefined;');
  });

  test('readme', () => {
    const varA = Symbol();
    const varB = Symbol();

    expect(assembleJs([
      'if(', varA, '!==0) {return ', varA, '*', varB, '}'
    ])).toBe('if(a!==0) {return a*b}');
  });
});
