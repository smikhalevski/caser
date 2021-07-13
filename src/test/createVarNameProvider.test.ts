import {createVarNameProvider, encode} from '../main/createVarNameProvider';

describe('createVarNameProvider', () => {

  test('', () => {
    expect(encode(52)).toBe('')
  })
});

describe('createVarNameProvider', () => {

  test('returns next var name', () => {
    const next = createVarNameProvider();

    expect(next()).toBe('a');
    expect(next()).toBe('b');

    for (let i = 3; i <= 25; i++) {
      next();
    }

    expect(next()).toBe('z');
    expect(next()).toBe('A');
    expect(next()).toBe('B');

    for (let i = 3; i <= 25; i++) {
      next();
    }

    expect(next()).toBe('Z');
    expect(next()).toBe('aa');

    for (let i = 1; i <= 24; i++) {
      next();
    }

    expect(next()).toBe('az');
    expect(next()).toBe('aA');

    for (let i = 1; i <= 24; i++) {
      next();
    }

    expect(next()).toBe('aZ');
    expect(next()).toBe('ba');

    for (let i = 1; i <= 1000; i++) {
      next();
    }

    expect(next()).toBe('un');
  });

  test('excludes names', () => {
    const next = createVarNameProvider(['b', 'c']);

    expect(next()).toBe('a');
    expect(next()).toBe('d');
  });
});
