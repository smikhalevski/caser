import {compilePropertyGetter, compilePropertyName} from '../main/object-keys';

describe('compilePropertyName', () => {

  test('compiles identifier', () => {
    expect(compilePropertyName('okay')).toBe('okay');
    expect(compilePropertyName('$okay')).toBe('$okay');
    expect(compilePropertyName(' _okay')).toBe('" _okay"');
    expect(compilePropertyName('#$%@')).toBe('"#$%@"');
    expect(compilePropertyName('')).toBe('""');
  });

  test('compiles array index', () => {
    expect(compilePropertyName('123')).toBe('123');
    expect(compilePropertyName('0')).toBe('0');
    expect(compilePropertyName('0123')).toBe('"0123"');
    expect(compilePropertyName('0.123')).toBe('"0.123"');
  });
});

describe('compilePropertyGetter', () => {

  test('compiles identifier', () => {
    expect(compilePropertyGetter('okay')).toBe('.okay');
    expect(compilePropertyGetter('$okay')).toBe('.$okay');
    expect(compilePropertyGetter(' _okay')).toBe('[" _okay"]');
    expect(compilePropertyGetter('#$%@')).toBe('["#$%@"]');
    expect(compilePropertyGetter('')).toBe('[""]');
  });

  test('compiles array index', () => {
    expect(compilePropertyGetter('123')).toBe('[123]');
    expect(compilePropertyGetter('0')).toBe('[0]');
    expect(compilePropertyGetter('0123')).toBe('["0123"]');
    expect(compilePropertyGetter('0.123')).toBe('["0.123"]');
  });

  test('compiles optional identifier', () => {
    expect(compilePropertyGetter('okay', true)).toBe('?.okay');
  });

  test('compiles optional array index', () => {
    expect(compilePropertyGetter('123', true)).toBe('?.[123]');
  });
});
