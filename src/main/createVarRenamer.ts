import {Var, VarRenamer} from './code-types';

/**
 * Creates callback that returns a unique name for a variable.
 *
 * @param varMapping The iterable list of var-name pairs.
 * @param encode Encodes the variable index as a valid name.
 * @returns The unique variable name.
 *
 * @see {@link encodeAlpha}
 */
export function createVarRenamer(varMapping?: [Var, string][] | Iterable<[Var, string]>, encode?: (index: number) => string | undefined): VarRenamer {

  let index = 0;

  const map = new Map(varMapping);
  const names = new Set(map.values());

  return (v) => {
    let name = map.get(v);

    if (!name) {
      do {
        name = encode ? encode(index) : '_' + index;
        ++index;
      } while (!name || names.has(name));

      map.set(v, name);
    }

    return name;
  };
}
