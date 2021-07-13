/**
 *
 * @param index
 */
export function encodeLetters(index: number): string {
  let str = '';

  index = Math.abs(index);
  do {
    let charCode = index % 52;
    charCode = charCode >= 26 ? 65 /*A*/ - 26 + charCode : 97 /*a*/ + charCode;

    str = String.fromCharCode(charCode) + str;
    index = Math.floor(index / 52);

  } while (index-- !== 0);

  return str;
}
