import {CgNodeType, FragmentChild, IVarRefCgNode} from './cg-ast-types';

export const enum WalkDirection {
  BACKWARDS = -1,
  FORWARDS = 1,
}

/**
 * Invokes `walker` for each child and descendant from `children` in the given `direction`, starting from `index`.
 *
 * @param children The array of children to walk over.
 * @param index The index in `children` from which the walking should start (inclusive).
 * @param direction The walking direction.
 * @param walker The callback that is invoked for each child. If `false` is returned from `cb` then walking is aborted.
 */
export function walkFragmentChildren(children: Array<FragmentChild>, index: number, direction: WalkDirection, walker: (child: FragmentChild, index: number, children: Array<FragmentChild>) => boolean | void): boolean {
  for (let i = index; direction === WalkDirection.FORWARDS ? i < children.length : i > -1; i += direction) {
    const child = children[i];
    if (
        walker(child, i, children) === false
        || child !== null && typeof child === 'object'
        && (child.nodeType === CgNodeType.VAR_ASSIGNMENT || child.nodeType === CgNodeType.FRAGMENT)
        && !walkFragmentChildren(child.children, direction === WalkDirection.FORWARDS ? 0 : child.children.length - 1, direction, walker)
    ) {
      return false;
    }
  }
  return true;
}

/**
 * - 0 if there are no {@link IVarRefCgNode} nodes in `children` after `index`;
 * - 1 if there's only one such node;
 * - 2 if there are more then two such nodes.
 */
export function countVarRefs(children: Array<FragmentChild>, index: number, varId: string): number {
  let refCount = 0;
  walkFragmentChildren(children, index, WalkDirection.FORWARDS, (child) => {
    return typeof child !== 'object' || child.nodeType !== CgNodeType.VAR_REF || child.varId !== varId || ++refCount !== 2;
  });
  return refCount;
}

/**
 * - Inlines var assignments that aren't retained and used only once;
 * - Removes var assignments that aren't retained and aren't used.
 */
export function inlineVarAssignments(children: Array<FragmentChild>): void {
  walkFragmentChildren(children, children.length - 1, WalkDirection.BACKWARDS, (child, index, children) => {
    if (typeof child !== 'object' || child.nodeType !== CgNodeType.VAR_ASSIGNMENT || child.retained) {
      return;
    }

    const refCount = countVarRefs(children, index + 1, child.varId);
    if (refCount === 2) {
      return;
    }

    children[index] = '';

    if (refCount === 0) {
      return;
    }
    walkFragmentChildren(children, index + 1, WalkDirection.FORWARDS, (otherChild, index, children) => {
      if (typeof otherChild !== 'object' || otherChild.nodeType !== CgNodeType.VAR_REF || otherChild.varId !== child.varId) {
        return;
      }
      children[index] = '';
      children.splice(index + 1, 0, ...child.children);
      return false;
    });
  });
}
