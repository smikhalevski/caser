/**
 * Reserved keywords that cannot be used as variable names in JS.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
 */
const reservedKeywords = (
  'break case catch class const continue debugger default delete do else export extends finally for function if ' +
  'import in instanceof new return super switch this throw try typeof var void while with yield enum implements ' +
  'interface let package private protected public static yield await abstract boolean byte char double final float ' +
  'goto int long native short synchronized throws transient volatile null true false'
).split(' ');

/**
 * Encodes index as a valid lowercase alpha variable name.
 *
 * @param index The variable index to encode.
 * @param forbiddenNames The array of names that cannot be returned.
 * @returns A variable name or `undefined` if an index corresponds to a forbidden name.
 */
export function encodeAlphaName(index: number, forbiddenNames = reservedKeywords): string | undefined {
  let name = '';

  do {
    name = String.fromCharCode(97 /*a*/ + (index % 26)) + name;
    index /= 26;
  } while (--index >= 0);

  if (forbiddenNames.indexOf(name) === -1) {
    return name;
  }
}
