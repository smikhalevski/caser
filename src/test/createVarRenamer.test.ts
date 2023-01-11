import { createVarRenamer, Var } from '../main';

describe('createVarRenamer', () => {
  test('returns unique name', () => {
    const varRenamer = createVarRenamer();
    const var1 = Symbol();
    const var2 = Symbol();

    expect(varRenamer(var1)).toBe('a');
    expect(varRenamer(var2)).toBe('b');
    expect(varRenamer(var1)).toBe('a');
    expect(varRenamer(var2)).toBe('b');
  });

  test('returns a predefined variable name', () => {
    const var1 = Symbol();
    const var2 = Symbol();

    const varRenamer = createVarRenamer([
      [var1, 'X'],
      [var2, 'Y'],
    ]);

    expect(varRenamer(var1)).toBe('X');
    expect(varRenamer(var2)).toBe('Y');
    expect(varRenamer(Symbol())).toBe('a');
    expect(varRenamer(Symbol())).toBe('b');
  });

  test('returns a name for a var object', () => {
    const var1: Var = { type: 'var', name: 'a' };
    const var2: Var = { type: 'var', name: 'a' };
    const var3: Var = { type: 'var', name: 'b' };

    const varRenamer = createVarRenamer();

    expect(varRenamer(var1)).toBe('a');
    expect(varRenamer(var2)).toBe('a2');
    expect(varRenamer(var3)).toBe('b');
  });
});
