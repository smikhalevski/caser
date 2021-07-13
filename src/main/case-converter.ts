import {words} from 'lodash-es';
import {Maybe} from './utility-types';

const toLowerCase = (str: string) => str.toLowerCase();

const toUpperCase = (str: string) => str.toUpperCase();

function createCaseConverter(rewrite: (word: string, index: number) => string): CaseConverter {
  return (str) => {
    if (str == null) {
      return '';
    }
    const words_ = words(str);
    for (let i = 0; i < words_.length; i++) {
      words_[i] = rewrite(words_[i], i);
    }
    return words_.join('');
  };
}

type CaseConverter = (str: Maybe<string>) => string;

/**
 * @example
 * upperFirst("foo bar"); // → "Foo bar"
 */
export const upperFirst: CaseConverter = (str) => str != null ? str.length === 0 ? str : str.charAt(0).toUpperCase() + str.substr(1) : '';

/**
 * @example
 * snakeCase("foo bar"); // → "foo_bar"
 */
export const snakeCase = createCaseConverter((word, index) => index === 0 ? toLowerCase(word) : '_' + toLowerCase(word));

/**
 * @example
 * kebabCase("foo bar"); // → "foo-bar"
 */
export const kebabCase = createCaseConverter((word, index) => index === 0 ? toLowerCase(word) : '-' + toLowerCase(word));

/**
 * @example
 * camelCase("foo bar"); // → "fooBar"
 */
export const camelCase = createCaseConverter((word, index) => index === 0 ? toLowerCase(word) : upperFirst(toLowerCase(word)));

/**
 * @example
 * constCase("foo bar"); // → "FOO_BAR"
 */
export const constCase: CaseConverter = (str) => toUpperCase(snakeCase(str));

/**
 * @example
 * pascalCase("foo bar"); // → "FooBar"
 */
export const pascalCase: CaseConverter = (str) => upperFirst(camelCase(str));
