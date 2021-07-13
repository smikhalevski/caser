import {IFragmentCgNode, visitCgNode} from '../codegen';
import {encodeLetters} from '../encodeLetters';

/**
 * Compiles fragment as a TypeScript source.
 */
export function compileTsSource(node: IFragmentCgNode): string {

  const varMap: Record<string, string> = Object.create(null);

  let varCount = 0;
  let src = '';

  visitCgNode(node, {
    fragment(node, next) {
      next();
    },
    varAssignment(node, next) {
      src += varMap[node.varId] ||= encodeLetters(varCount++);
      src += '=';
      next();
      src += ';';
    },
    varRef(node) {
      src += varMap[node.varId] ||= encodeLetters(varCount++);
    },
    literal(source) {
      if (typeof source === 'number' || typeof source === 'string') {
        src += source;
      }
    },
  });
  return src;
}
