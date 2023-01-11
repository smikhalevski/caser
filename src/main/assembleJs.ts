import { Code } from './code-types';
import { createVarRenamer } from './createVarRenamer';

/**
 * Assembles code fragment into a compilable code string.
 *
 * @param code The code fragment to assemble.
 * @param varRenamer The callback that returns a variable name for a variable.
 * @returns The compilable string.
 */
export function assembleJs(code: Code, varRenamer = createVarRenamer()): string {
  if (typeof code === 'symbol') {
    return varRenamer(code);
  }

  if (code === null || typeof code !== 'object') {
    return '' + code;
  }

  if (Array.isArray(code)) {
    let src = '';
    for (let i = 0; i < code.length; ++i) {
      src += assembleJs(code[i], varRenamer);
    }
    return src;
  }

  if (code.type === 'var') {
    return varRenamer(code);
  }

  if (code.type === 'varAssign') {
    return varRenamer(code.var) + '=' + assembleJs(code.children, varRenamer) + ';';
  }

  let src = 'var ' + varRenamer(code.var);

  if (code.children.length === 0) {
    return src + ';';
  }

  const valueSrc = assembleJs(code.children, varRenamer);

  if (valueSrc) {
    src += '=' + valueSrc;
  }
  return src + ';';
}
