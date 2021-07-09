import {compilePropertyName} from '../main/object-keys';

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
