import {Maybe} from '../misc';

const reLf = /\n/g;

/**
 * Returns the source code of a JavaScript doc comment.
 */
export function compileDocComment(str: Maybe<string>): string {
  return str ? '/**\n * ' + str.replace(reLf, '\n * ') + '\n */\n' : '';
}
