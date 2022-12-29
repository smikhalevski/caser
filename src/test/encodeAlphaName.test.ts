import { encodeAlphaName } from '../main';

describe('encodeAlphaName', () => {
  test('encodes numbers as latin letters', () => {
    expect(encodeAlphaName(0)).toBe('a');
    expect(encodeAlphaName(25)).toBe('z');

    expect(encodeAlphaName(26)).toBe('aa');
    expect(encodeAlphaName(51)).toBe('az');

    expect(encodeAlphaName(52)).toBe('ba');
    expect(encodeAlphaName(Number.MAX_SAFE_INTEGER)).toBe('bktxhsoghkkf');
  });

  test('encodes floating numbers', () => {
    expect(encodeAlphaName(10.7)).toBe('k');
  });

  test('does not encode as reserved keyword', () => {
    expect(encodeAlphaName(118)).toBe(undefined);
  });
});
