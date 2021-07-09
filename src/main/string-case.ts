import {Maybe} from './utility-types';

let reWord: RegExp;

try {
  reWord = /[\p{Letter}\d]+/gu;
} catch {
  // https://github.com/lodash/lodash/blob/2f79053d7bc7c9c9561a30dda202b3dcd2b72b90/words.js#L8
  reWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
}

/**
 * Converts string to an array of words.
 */
export const toWords = (str: Maybe<string>): Array<string> => str?.match(reWord) || [];

const toLowerCase = (str: string) => str.toLowerCase();

const toUpperCase = (str: string) => str.toUpperCase();

function createCaser(rewrite: (word: string, index: number) => string): (str: Maybe<string>) => string {
  return (str) => {
    const words = toWords(str);
    for (let i = 0; i < words.length; i++) {
      words[i] = rewrite(words[i], i);
    }
    return words.join('');
  };
}

/**
 * @example
 * upperFirst("foo bar"); // → "Foo bar"
 */
export function upperFirst(str: Maybe<string>): string {
  return str != null ? str.length === 0 ? str : str.charAt(0).toUpperCase() + str.substr(1) : '';
}

/**
 * @example
 * snakeCase("foo bar"); // → "foo_bar"
 */
export const snakeCase = createCaser((word, index) => index === 0 ? toLowerCase(word) : '_' + toLowerCase(word));

/**
 * @example
 * kebabCase("foo bar"); // → "foo-bar"
 */
export const kebabCase = createCaser((word, index) => index === 0 ? toLowerCase(word) : '-' + toLowerCase(word));

/**
 * @example
 * camelCase("foo bar"); // → "fooBar"
 */
export const camelCase = createCaser((word, index) => index === 0 ? toLowerCase(word) : upperFirst(toLowerCase(word)));

/**
 * @example
 * constCase("foo bar"); // → "FOO_BAR"
 */
export const constCase = (str: Maybe<string>): string => toUpperCase(snakeCase(str));

/**
 * @example
 * pascalCase("foo bar"); // → "FooBar"
 */
export const pascalCase = (str: Maybe<string>): string => upperFirst(camelCase(str));
