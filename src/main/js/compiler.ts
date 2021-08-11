import {IFragmentCgNode, visitCgNode} from '../codegen';
import {createVarNameProvider} from '../createVarNameProvider';
import {createMap} from '../misc';

/**
 * Compiles a fragment to a JavaScript source code.
 */
export function compileJsSource(node: IFragmentCgNode, varNameProvider = createVarNameProvider()): string {

  const varMap = createMap<string>();

  let src = '';

  visitCgNode(node, {
    fragment(node, next) {
      next();
    },
    varAssignment(node, next) {
      src += `let ${varMap[node.varId] ||= varNameProvider.next()}=`;
      next();
      src += ';';
    },
    varRef(node) {
      src += varMap[node.varId] ||= varNameProvider.next();
    },
    literal(source) {
      if (typeof source === 'number' || typeof source === 'string') {
        src += source;
      }
    },
  });
  return src;
}
