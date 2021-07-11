import {CgNodeType, IVarRefCgNode, SourceChild} from './cg-ast-types';

/**
 * Invokes `walker` for each child and descendent from `children` starting from `index`.
 *
 * @param children The array of children to traverse
 * @param index The index in `children` from which the traversal should start.
 * @param walker The callback that is invoked for each child. If `false` is returned then traversal is aborted.
 */
export function walkChildren(children: Array<SourceChild>, index: number, walker: (node: SourceChild, index: number, children: Array<SourceChild>) => false | unknown): void {
  for (let i = index; i < children.length; i++) {
    const child = children[i];
    if (walker(child, i, children) === false) {
      break;
    }
    if (typeof child !== 'object') {
      continue;
    }
    if (child.nodeType === CgNodeType.VAR_ASSIGNMENT || child.nodeType === CgNodeType.BLOCK) {
      walkChildren(child.valueNode.children, 0, walker);
    }
  }
}

/**
 * Returns 0 if there are no {@link IVarRefCgNode} nodes in `children` after `index`, 1 if there's only one such node
 * or 2 if there are more then two such nodes.
 */
export function countVarRefs(children: Array<SourceChild>, index: number, varId: string): number {
  let refCount = 0;
  walkChildren(children, index, (child) => {
    return typeof child !== 'object' || child.nodeType !== CgNodeType.VAR_REF || child.varId !== varId || ++refCount !== 2;
  });
  return refCount;
}

/**
 * Applies optimizations to source children.
 *
 * - Inlines var assignments that aren't retained and used only once;
 * - Removes var assignments that aren't used.
 */
export function optimizeChildren(children: Array<SourceChild>): void {
  walkChildren(children, 0, (child, index, children) => {
    if (typeof child !== 'object' || child.nodeType !== CgNodeType.VAR_ASSIGNMENT || child.retained) {
      return;
    }
    const refCount = countVarRefs(children, index + 1, child.varId);
    if (refCount < 2) {
      children[index] = '';
    }
    if (refCount === 0) {
      return;
    }
    walkChildren(children, index + 1, (otherChild, index, children) => {
      if (typeof otherChild !== 'object' || otherChild.nodeType !== CgNodeType.VAR_REF || otherChild.varId !== child.varId) {
        return;
      }
      children[index] = '';
      children.splice(index + 1, 0, ...child.valueNode.children);
      return false;
    });
  });
}
