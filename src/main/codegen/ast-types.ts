/**
 * The type of a codegen node.
 */
export const enum CgNodeType {
  VAR_ASSIGNMENT = 'VAR_ASSIGNMENT',
  VAR_REF = 'VAR_REF',
  FRAGMENT = 'FRAGMENT',
}

/**
 * A codegen node.
 */
export type CgNode =
    | IVarAssignmentCgNode
    | IVarRefCgNode
    | IFragmentCgNode;

/**
 * The valid child of a code fragment.
 */
export type FragmentChild = CgNode | string | number | boolean;

/**
 * The source code fragment.
 */
export interface IFragmentCgNode {
  nodeType: CgNodeType.FRAGMENT;
  children: Array<FragmentChild>;

  /**
   * If `true` then fragment isn't merged with enclosing fragment when nested. When retained, fragment creates a scope
   * in which {@link IVarAssignmentCgNode} would to be inlined during optimization.
   */
  retained: boolean;
}

/**
 * The variable assignment node.
 */
export interface IVarAssignmentCgNode {
  nodeType: CgNodeType.VAR_ASSIGNMENT;

  /**
   * The ID of the assigned variable.
   */
  varId: string;

  /**
   * The value that is assigned to the variable.
   */
  children: Array<FragmentChild>;

  /**
   * If `true` then this assignment would always be preserved in the output. Otherwise it can be inlined if used once
   * or removed if unused.
   */
  retained: boolean;
}

/**
 * The variable reference node.
 */
export interface IVarRefCgNode {
  nodeType: CgNodeType.VAR_REF;

  /**
   * The ID of the variable. Variable references with the same index refer to the same variable.
   */
  varId: string;
}
