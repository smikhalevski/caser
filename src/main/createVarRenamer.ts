import { Var, VarRenamer } from './code-types';
import { encodeAlphaName } from './encodeAlphaName';

/**
 * Creates callback that returns a unique name for a variable.
 *
 * @param varNameMapping The iterable list of var-name pairs.
 * @param encodeName Encodes the variable index as a valid name.
 * @returns The unique variable name.
 *
 * @see {@linkcode encodeAlphaName}
 */
export function createVarRenamer(
  varNameMapping?: [Var, string][] | Iterable<[Var, string]>,
  encodeName = encodeAlphaName
): VarRenamer {
  let index = 0;

  const map = new Map(varNameMapping);
  const names = new Set(map.values());

  return v => {
    let name = map.get(v);

    if (name) {
      return name;
    }

    do {
      name = encodeName(index);
      ++index;
    } while (!name || names.has(name));

    map.set(v, name);

    return name;
  };
}
