import {IFragmentCgNode} from './cg-ast-types';
import {createVarNameProvider} from '../createVarNameProvider';
import {visitCgNode} from './cg-visitor';

export function compileTsSource(node: IFragmentCgNode): string {

  const varNameProvider = createVarNameProvider();

  const varMap: Record<string, string> = Object.create(null);

  let src = '';

  visitCgNode(node, {

    fragment(node, next) {
      next();
    },

    varAssignment(node, next) {
      src += varMap[node.varId] ||= varNameProvider.next();
      src += '=';
      next();
      src += ';';
    },

    varRef(node) {
      src += varMap[node.varId] ||= varNameProvider.next();
    },

    source(source) {
      src += source;
    },
  });

  return src;
}
