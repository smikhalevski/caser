/**
 * Types of the codegen AST nodes.
 */
export const enum CgNodeType {
  VAR_ASSIGNMENT = 'VAR_ASSIGNMENT',
  VAR_REF = 'VAR_REF',
  COMMENT = 'COMMENT',
  BLOCK = 'BLOCK',
  SOURCE = 'SOURCE',
}

export type CgNode =
    | ISourceCgNode
    | IBlockCgNode
    | IVarAssignmentCgNode
    | IVarRefCgNode
    | ICommentCgNode;

/**
 * Valid child of a source node.
 */
export type SourceChild =
    | IBlockCgNode
    | IVarAssignmentCgNode
    | IVarRefCgNode
    | ICommentCgNode
    | string;

/**
 * The source code node.
 */
export interface ISourceCgNode {
  nodeType: CgNodeType.SOURCE;
  children: Array<SourceChild>;
}

/**
 * The source code block node defines the scope in which {@link IVarAssignmentCgNode} can be inlined.
 */
export interface IBlockCgNode {
  nodeType: CgNodeType.BLOCK;

  /**
   * The source code of this block.
   */
  valueNode: ISourceCgNode;
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
  valueNode: ISourceCgNode;

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

/**
 * The comment node.
 */
export interface ICommentCgNode {
  nodeType: CgNodeType.COMMENT;

  /**
   * The comment text value.
   */
  value: string;
}
