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

  const nameMap = new Map(varNameMapping);
  const names = new Set(nameMap.values());
  const varCounters = new Map<string, number>();

  return v => {
    let name = nameMap.get(v);

    if (name) {
      return name;
    }

    if (typeof v === 'object' && v.name) {
      name = v.name;

      let counter = varCounters.get(name);

      if (counter !== undefined) {
        name += counter++;
      } else {
        counter = 2;
      }

      nameMap.set(v, name);
      varCounters.set(v.name, counter);
      return name;
    }

    do {
      name = encodeName(index);
      ++index;
    } while (!name || names.has(name));

    nameMap.set(v, name);

    return name;
  };
}
