export interface IVarNameProvider {

  /**
   * Returns the next valid variable name.
   */
  next(): string;

  /**
   * Returns allocated name back to provider.
   */
  free(varName: string): void;
}

export function createVarNameProvider(): IVarNameProvider {
  const excludedVarNames = new Set<string>();
  return {

    next() {
      let varName;
      let index = 0;
      while (excludedVarNames.has(varName = encodeLetters(index))) {
        index++;
      }
      excludedVarNames.add(varName);
      return varName;
    },

    free(varName) {
      excludedVarNames.delete(varName);
    },
  };
}

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
