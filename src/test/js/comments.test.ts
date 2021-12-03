import {compileDocComment} from '../../main/js/comments';

describe('compileDocComment', () => {

  test('returns an empty string for an empty comment', () => {
    expect(compileDocComment(null)).toBe('');
    expect(compileDocComment(undefined)).toBe('');
    expect(compileDocComment('')).toBe('');
  });

  test('returns a doc comment', () => {
    expect(compileDocComment('Okay')).toBe('/**\n * Okay\n */\n');
  });

  test('returns a multiline doc comment', () => {
    expect(compileDocComment('Okay\nYay')).toBe('/**\n * Okay\n * Yay\n */\n');
  });
});
