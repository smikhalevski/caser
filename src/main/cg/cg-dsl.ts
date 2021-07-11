import {
  CgNode,
  CgNodeType,
  IBlockCgNode,
  ICommentCgNode,
  ISourceCgNode,
  IVarAssignmentCgNode,
  IVarRefCgNode,
  SourceChild,
} from './cg-ast-types';

export type CgTemplateParam = Array<CgTemplateParam> | CgNode | boolean | null | undefined;

export interface VarRefFactory {

  /**
   * Returns the new variable reference.
   */
  (): IVarRefCgNode;

  /**
   * Returns the ID of the next variable.
   */
  nextVarId: () => string;
}

export interface CgTemplate {

  (strs: TemplateStringsArray, ...params: Array<CgTemplateParam>): ISourceCgNode;

  /**
   * Returns the new source code block node defines the scope in which {@link IVarAssignmentCgNode} can be inlined.
   */
  block(...nodes: Array<CgTemplateParam>): IBlockCgNode;

  /**
   * Returns the new variable assignment node.
   *
   * @param varRef The variable that is being assigned.
   * @param value The value that is assigned to the variable.
   * @param retain If `true` then this assignment would always be preserved in the output. Otherwise it can be inlined
   *     if used once or removed if unused.
   */
  assignment(varRef: IVarRefCgNode, value: CgTemplateParam, retain?: boolean): IVarAssignmentCgNode;

  /**
   * Returns the new variable reference node.
   */
  var: VarRefFactory;

  /**
   * Returns the new comment node.
   *
   * @param value The comment text value.
   */
  comment(value: string | undefined | null): ICommentCgNode;
}

function walkTemplateParam(param: CgTemplateParam, walker: (node: CgNode) => void) {
  if (Array.isArray(param)) {
    for (let i = 0; i < param.length; i++) {
      walkTemplateParam(param[i], walker);
    }
    return;
  }
  if (param != null && typeof param === 'object') {
    walker(param);
  }
}

export const ts: CgTemplate = function (strs) {
  const children: Array<SourceChild> = [strs[0]];

  for (let i = 1; i < strs.length; i++) {
    walkTemplateParam(arguments[i], (node) => {
      if (node.nodeType === CgNodeType.SOURCE) {
        children.push(...node.children);
      } else {
        children.push(node);
      }
    });
    children.push(strs[i]);
  }

  return {
    nodeType: CgNodeType.SOURCE,
    children,
  };
};

ts.block = (...nodes) => {
  return {
    nodeType: CgNodeType.BLOCK,
    valueNode: ts`${nodes}`,
  };
};

ts.assignment = (varRef, value, retained) => {
  return {
    nodeType: CgNodeType.VAR_ASSIGNMENT,
    varId: varRef.varId,
    valueNode: ts`${value}`,
    retained: retained || false,
  };
};

const varFactory: VarRefFactory = (): IVarRefCgNode => {
  return {
    nodeType: CgNodeType.VAR_REF,
    varId: varFactory.nextVarId(),
  };
};

let varIndex = 0;

varFactory.nextVarId = () => 'var' + varIndex++;

ts.var = varFactory;

ts.comment = (value) => {
  return {
    nodeType: CgNodeType.COMMENT,
    value: value || '',
  };
};
