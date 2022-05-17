import {compileFunction} from '../main';

describe('compileFunction', () => {

  test('compiles a function without arguments', () => {
    expect(compileFunction([], 'return "ok"')()).toBe('ok');
  });

  test('compiles a function with one argument', () => {
    const argVar = Symbol();

    expect(compileFunction([argVar], ['return ', argVar, '+1'])(2)).toBe(3);
  });

  test('compiles a function with multiple arguments', () => {
    const arg1Var = Symbol();
    const arg2Var = Symbol();
    const arg3Var = Symbol();

    expect(compileFunction([arg1Var, arg2Var, arg3Var], ['return ', arg1Var, '+', arg2Var, '+', arg3Var])(1, 2, 3)).toBe(6);
  });

  test('compiles a function with the single bound value', () => {
    const boundVar = Symbol();

    expect(compileFunction([], ['return ', boundVar, '()'], [[boundVar, () => 'ok']])()).toBe('ok');
  });

  test('compiles a function with multiple bound values', () => {
    const bound1Var = Symbol();
    const bound2Var = Symbol();

    expect(compileFunction([], ['return ', bound1Var, '()+', bound2Var, '()'], [[bound1Var, () => 3], [bound2Var, () => 7]])()).toBe(10);
  });

  test('compiles a function with repeated bound vars', () => {
    const boundVar = Symbol();

    expect(compileFunction([], ['return ', boundVar], [[boundVar, 111], [boundVar, 222]])()).toBe(222);
  });

  test('compiles a function with repeated bound values', () => {
    const bound1Var = Symbol();
    const bound2Var = Symbol();

    expect(compileFunction([], ['return ', bound1Var, '===', bound2Var], [[bound1Var, 111], [bound2Var, 111]])()).toBe(true);
  });

  test('compiles a function with arguments and bound values', () => {
    const arg1Var = Symbol();
    const arg2Var = Symbol();
    const bound1Var = Symbol();
    const bound2Var = Symbol();

    expect(compileFunction(
        [arg1Var, arg2Var],
        ['return ', bound1Var, '(', arg1Var, ')+', bound2Var, '(', arg2Var, ')'],
        [
          [bound1Var, (value: number) => value * 3],
          [bound2Var, (value: number) => value * 7],
        ])(5, 2)
    ).toBe(29);
  });

  test('readme', () => {

    const arg = Symbol();
    const varA = Symbol();
    const varB = Symbol();

    const fn = compileFunction(
        [arg],
        [
          'var ', varA, '=123;',
          'return ', varA, '+', arg, '+', varB, '.fooBar',
        ],
        [[varB, {fooBar: 456}]],
    );

    expect(fn(789)).toBe((1368));
  });
});
