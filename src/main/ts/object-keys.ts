let reIdentifier: RegExp;

try {
  reIdentifier = /^[\p{Letter}_$][\p{Letter}\d_$]*$/u;
} catch {
  reIdentifier = /^[a-zA-Z_$][\w$]*$/;
}

const reArrayIndex = /^(?:0|[1-9]\d*)$/;

/**
 * Returns `true` if `str` is a valid JavaScript identifier.
 */
export function isIdentifier(str: string): boolean {
  return reIdentifier.test(str);
}

/**
 * Returns `true` if `str` is a valid JavaScript array index.
 */
export function isArrayIndex(str: string): boolean {
  return reArrayIndex.test(str);
}

/**
 * Wraps given property key with quotes if needed so it can be used as a property name in an object declaration.
 *
 * @example
 * compilePropertyName('foo bar'); // → '"foo bar"'
 *
 * compilePropertyName('fooBar'); // → 'fooBar'
 *
 * compilePropertyName('0'); // → '0'
 *
 * compilePropertyName('0123'); // → '"0123"'
 */
export function compilePropertyName(str: string): string {
  return isIdentifier(str) || isArrayIndex(str) ? str : JSON.stringify(str);
}

/**
 * Returns a getter of the property.
 *
 * @param key The key of the property.
 * @param optional If `true` then optional chaining syntax is used.
 *
 * @example
 * compilePropertyAccessor('foo'); // → .foo
 *
 * compilePropertyAccessor('foo bar', true); // → ?.["foo bar"]
 */
export function compilePropertyAccessor(key: string, optional = false): string {
  if (isIdentifier(key)) {
    return (optional ? '?.' : '.') + key;
  }
  return (optional ? '?.' : '') + '[' + (isArrayIndex(key) ? key : JSON.stringify(key)) + ']';
}
