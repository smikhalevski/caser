import { createVarRenamer } from '../main';

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
});
