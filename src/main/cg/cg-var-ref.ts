import {CgNodeType, IFragmentCgNode, IVarRefCgNode} from './cg-ast-types';
import {walkFragmentChildren} from './cg-optimizer';

export function collectVarRefs(node: IFragmentCgNode, excluded?: Array<IVarRefCgNode>): Array<IVarRefCgNode> {
  const varRefMap: Record<string, IVarRefCgNode> = Object.create(null);
  walkFragmentChildren(node.children, 0, (child) => {
    if (typeof child !== 'object' || child.nodeType !== CgNodeType.VAR_REF) {
      return;
    }
    if (excluded) {
      for (let i = 0; i < excluded.length; i++) {
        if (excluded[i].varId === child.varId) {
          return;
        }
      }
    }
    varRefMap[child.varId] = child;
  });
  return Object.values(varRefMap);
}
