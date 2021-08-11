import {CgNode, CgNodeType, FragmentChild, IFragmentCgNode, IVarAssignmentCgNode, IVarRefCgNode} from './ast-types';

export interface ICgNodeVisitor {
  fragment?(node: IFragmentCgNode, next: () => void): void;
  varAssignment?(node: IVarAssignmentCgNode, next: () => void): void;
  varRef?(node: IVarRefCgNode): void;
  literal?(value: string | number | boolean): void;
}

/**
 * Invokes callbacks from `visitor` for each node tree under `node`.
 *
 * @param node The root of the codegen node tree.
 * @param visitor Callbacks that must be invoked for nodes under `node`.
 */
export function visitCgNode(node: CgNode, visitor: ICgNodeVisitor): void {
  switch (node.nodeType) {

    case CgNodeType.FRAGMENT:
      visitor.fragment?.(node, () => visitChildren(node.children, visitor));
      break;

    case CgNodeType.VAR_ASSIGNMENT:
      visitor.varAssignment?.(node, () => visitChildren(node.children, visitor));
      break;

    case CgNodeType.VAR_REF:
      visitor.varRef?.(node);
      break;
  }
}

function visitChildren(children: Array<FragmentChild>, visitor: ICgNodeVisitor): void {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (typeof child === 'object') {
      visitCgNode(child, visitor);
    } else {
      visitor.literal?.(child);
    }
  }
}
