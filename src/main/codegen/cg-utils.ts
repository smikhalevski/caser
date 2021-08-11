import {CgNodeType, FragmentChild, IFragmentCgNode, IVarRefCgNode} from './ast-types';
import {WalkDirection, walkFragmentChildren} from './optimizer';
import {template} from './template';

/**
 * Returns the list of {@link IVarRefCgNode} that were used in the fragment.
 *
 * @param node The fragment to traverse.
 * @param excludedVarRefs The list of var refs that must be excluded from the output.
 */
export function collectVarRefs(node: IFragmentCgNode, excludedVarRefs?: Array<IVarRefCgNode>): Array<IVarRefCgNode> {
  const varRefMap: Record<string, IVarRefCgNode> = Object.create(null);

  const excludedVarIds = excludedVarRefs?.map((varRef) => varRef.varId);

  walkFragmentChildren(node.children, 0, WalkDirection.FORWARDS, (child) => {
    if (typeof child === 'object' && child.nodeType === CgNodeType.VAR_REF && !excludedVarIds?.includes(child.varId)) {
      varRefMap[child.varId] = child;
    }
  });
  return Object.values(varRefMap);
}

export function joinFragmentChildren(children: Array<FragmentChild>, separator: FragmentChild): IFragmentCgNode {
  return template(children.map((child, i) => i === 0 ? child : template(separator, child)));
}
