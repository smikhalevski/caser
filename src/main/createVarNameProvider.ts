const fromCharCode = String.fromCharCode;

const nextCharCode = (charCode: number): number => charCode === 122 /*z*/ ? 65 /*A*/ : charCode === 90 /*Z*/ ? -1 : charCode + 1;

function nextVarName(charCodes: Array<number>): string {
  let charCode = nextCharCode(charCodes[charCodes.length - 1]);

  if (charCode !== -1) {
    charCodes[charCodes.length - 1] = charCode;
    return fromCharCode(...charCodes);
  }

  for (let i = charCodes.length - 2; i > -1; i--) {
    const charCode = nextCharCode(charCodes[i]);

    if (charCode !== -1) {
      charCodes[i] = charCode;
      charCodes.fill(97 /*a*/, i + 1);
      return fromCharCode(...charCodes);
    }
  }

  charCodes.push(97 /*a*/);
  charCodes.fill(97 /*a*/);

  return fromCharCode(...charCodes);
}

/**
 * Creates a callback that returns the next valid variable name when called.
 *
 * @param excludedVarNames The list of the excluded names.
 */
export function createVarNameProvider(excludedVarNames?: ReadonlyArray<string>): () => string {

  const charCodes: Array<number> = [97 - 1 /*a - 1*/];

  return () => {
    let name = nextVarName(charCodes);

    while (excludedVarNames?.includes(name)) {
      name = nextVarName(charCodes);
    }
    return name;
  };
}
