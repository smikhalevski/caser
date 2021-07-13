import {compilePropertyAccessor, compilePropertyName} from '../../main/ts/object-keys';

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

describe('compilePropertyAccessor', () => {

  test('compiles identifier', () => {
    expect(compilePropertyAccessor('okay')).toBe('.okay');
    expect(compilePropertyAccessor('$okay')).toBe('.$okay');
    expect(compilePropertyAccessor(' _okay')).toBe('[" _okay"]');
    expect(compilePropertyAccessor('#$%@')).toBe('["#$%@"]');
    expect(compilePropertyAccessor('')).toBe('[""]');
  });

  test('compiles array index', () => {
    expect(compilePropertyAccessor('123')).toBe('[123]');
    expect(compilePropertyAccessor('0')).toBe('[0]');
    expect(compilePropertyAccessor('0123')).toBe('["0123"]');
    expect(compilePropertyAccessor('0.123')).toBe('["0.123"]');
  });

  test('compiles optional identifier', () => {
    expect(compilePropertyAccessor('okay', true)).toBe('?.okay');
  });

  test('compiles optional array index', () => {
    expect(compilePropertyAccessor('123', true)).toBe('?.[123]');
  });
});
