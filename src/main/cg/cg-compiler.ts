import {CgNodeType, ISourceCgNode} from './cg-ast-types';
import {walkChildren} from './cg-ast';
import {compileDocComment} from '../comments';
import {createVarNameProvider} from '../createVarNameProvider';

export function compileTsSource(node: ISourceCgNode): string {

  const nextVarName = createVarNameProvider();

  const varMap: Record<string, string> = Object.create(null);

  let src = '';

  walkChildren(node.children, 0, (child) => {
    if (typeof child === 'string') {
      src += child;
      return;
    }
    switch (child.nodeType) {

      case CgNodeType.COMMENT:
        src += compileDocComment(child.value);
        break;

      case CgNodeType.VAR_ASSIGNMENT:
        src += varMap[child.varId] ||= nextVarName();
        src += '=';
        break;

      case CgNodeType.VAR_REF:
        src += varMap[child.varId] ||= nextVarName();
        break;
    }
  });

  return src;
}
