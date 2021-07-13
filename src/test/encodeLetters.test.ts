import {encodeLetters} from '../main/encodeLetters';

describe('encodeLetters', () => {

  test('encodes numbers as latin letters', () => {
    expect(encodeLetters(0)).toBe('a');
    expect(encodeLetters(25)).toBe('z');

    expect(encodeLetters(26)).toBe('A');
    expect(encodeLetters(51)).toBe('Z');

    expect(encodeLetters(52)).toBe('aa');
    expect(encodeLetters(Number.MAX_SAFE_INTEGER)).toBe('clymoUDoRF');
  });

  test('ignores sign', () => {
    expect(encodeLetters(-100)).toBe('aW');
  });
});
