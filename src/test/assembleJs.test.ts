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

    expect(assembleJs([aVar, '=', bVar, '+', aVar])).toBe('_0=_1+_0');
  });

  test('assembles var declaration', () => {
    expect(assembleJs(varDeclare(Symbol()))).toBe('var _0;');
    expect(assembleJs(varDeclare(Symbol(), undefined))).toBe('var _0;');
  });

  test('assembles var declaration with initial value', () => {
    expect(assembleJs(varDeclare(Symbol(), '123'))).toBe('var _0=123;');
  });

  test('assembles var assignment', () => {
    expect(assembleJs(varAssign(Symbol(), '123'))).toBe('_0=123;');
    expect(assembleJs(varAssign(Symbol(), undefined))).toBe('_0=undefined;');
  });

  test('readme', () => {
    const varA = Symbol();
    const varB = Symbol();

    expect(assembleJs([
      'if(', varA, '!==0) {return ', varA, '*', varB, '}'
    ])).toBe('if(_0!==0) {return _0*_1}');
  });
});
