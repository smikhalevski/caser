import {camelCase, constCase} from '../main/case-converter';

describe('constCase', () => {

  test('respects unicode words', () => {
    expect(camelCase(constCase('aaBb'))).toEqual('aaBb');
  });
});
