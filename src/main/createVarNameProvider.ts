import {encodeLetters} from './encodeLetters';

/**
 * Produces sequential variable names.
 */
export interface IVarNameProvider {

  /**
   * Returns the next variable name.
   */
  next(): string;

  /**
   * Resets the provider.
   */
  reset(): void;
}

/**
 * Creates a new {@link IVarNameProvider}.
 *
 * @param excludedVarNames The list of var names that shouldn't be returned by {@link IVarNameProvider.next}.
 */
export function createVarNameProvider(excludedVarNames?: Array<string>): IVarNameProvider {
  let varCount = 0;

  const next = () => {
    let varName;
    do {
      varName = encodeLetters(varCount++);
    } while (excludedVarNames?.includes(varName));
    return varName;
  };

  const reset = () => {
    varCount = 0;
  };

  return {
    next,
    reset,
  };
}
