export const enum TsNodeType {
  VAR_ASSIGNMENT = 'VAR_ASSIGNMENT',
  VAR_REF = 'VAR_REF',
  SOURCE = 'SOURCE',
}

export type TsNode =
    | IVarAssignmentTsNode
    | IVarRefTsNode
    | ISourceTsNode;

export interface IVarAssignmentTsNode {
  nodeType: TsNodeType.VAR_ASSIGNMENT;
  varRef: IVarRefTsNode;
  valueNode: ISourceTsNode;
}

export interface IVarRefTsNode {
  nodeType: TsNodeType.VAR_REF;
  id: string;
}

export type SourceChild = string | IVarAssignmentTsNode | IVarRefTsNode;

export interface ISourceTsNode {
  nodeType: TsNodeType.SOURCE;
  children: Array<SourceChild>;
}
