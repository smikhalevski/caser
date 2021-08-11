const {floor, abs} = Math;

const TOTAL_LETTERS = 52;

/**
 * Encodes an integer part of number as a string of ASCII alpha characters `[a-zA-Z]`.
 *
 * ```ts
 * encodeLetters(100); // → 'aW'
 * ```
 *
 * @param value The number to encode.
 */
export function encodeLetters(value: number): string {
  let str = '';

  value = floor(abs(value));

  do {
    let charCode = value % TOTAL_LETTERS;

    if (charCode >= TOTAL_LETTERS / 2) {
      charCode = 65 /*A*/ - TOTAL_LETTERS / 2 + charCode;
    } else {
      charCode = 97 /*a*/ + charCode;
    }

    str = String.fromCharCode(charCode) + str;
    value = floor(value / TOTAL_LETTERS);

  } while (value-- !== 0);

  return str;
}
