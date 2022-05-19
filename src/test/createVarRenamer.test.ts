import {createVarRenamer} from '../main';

describe('createVarRenamer', () => {

  test('returns unique name', () => {
    const varRenamer = createVarRenamer();
    const var1 = Symbol();
    const var2 = Symbol();

    expect(varRenamer(var1)).toBe('_0');
    expect(varRenamer(var2)).toBe('_1');
    expect(varRenamer(var1)).toBe('_0');
    expect(varRenamer(var2)).toBe('_1');
  });

  test('returns a predefined variable name', () => {
    const var1 = Symbol();
    const var2 = Symbol();

    const varRenamer = createVarRenamer([[var1, '_1'], [var2, '_2']]);

    expect(varRenamer(var1)).toBe('_1');
    expect(varRenamer(var2)).toBe('_2');
    expect(varRenamer(Symbol())).toBe('_0');
    expect(varRenamer(Symbol())).toBe('_3');
  });
});
