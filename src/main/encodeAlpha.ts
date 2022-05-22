/**
 * Reserved keywords that cannot be used as variable names in JS.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
 */
const reservedKeywords = new Set('break case catch class const continue debugger default delete do else export extends finally for function if import  in  instanceof  new return super switch this throw try typeof var void while with yield enum implements interface let package private protected public static yield await abstract boolean byte char double final float goto int long native short synchronized throws transient volatile null true false'.split(' '));

/**
 * Encodes index as a valid alpha variable name.
 *
 * @param index The variable index to encode.
 * @returns A variable name or `undefined` if index encodes as a reserved keyword.
 */
export function encodeAlpha(index: number): string | undefined {
  let name = '';

  do {
    name = String.fromCharCode(97 /*a*/ + index % 26) + name;
    index /= 26;
  } while (--index >= 0);

  if (!reservedKeywords.has(name)) {
    return name;
  }
}
