import {ISourceTsNode, IVarAssignmentTsNode, IVarRefTsNode, SourceChild, TsNode, TsNodeType} from './ts-dsl-ast';

type TsTemplateParam = TsNode | boolean | null | undefined;

export interface TsTemplate {

  (strs: TemplateStringsArray, ...params: Array<TsTemplateParam>): ISourceTsNode;

  assign(varRef: IVarRefTsNode, value: TsTemplateParam, retain?: boolean): IVarAssignmentTsNode | null;

  var(): IVarRefTsNode;
}

export const ts: TsTemplate = function (strs) {
  const children: Array<SourceChild> = [strs[0]];

  let l = 1;

  for (let i = 1; i < strs.length; i++) {
    const param: TsTemplateParam = arguments[i];

    if (!param || typeof param !== 'object') {
      continue;
    }

    if (param.nodeType !== TsNodeType.SOURCE) {
      l = children.push(param, strs[i]);
      continue;
    }

    const c = param.children;

    children[l - 1] += c[0] as string;
    if (c.length > 1) {
      l = children.push(...c.slice(1));
    }
    children[l - 1] += strs[i];
  }

  return {
    nodeType: TsNodeType.SOURCE,
    children,
  };
};

ts.assign = (varRef, value) => {
  return {
    nodeType: TsNodeType.VAR_ASSIGNMENT,
    varRef,
    valueNode: ts`${value}`,
  };
};

ts.var = () => {
  return {
    nodeType: TsNodeType.VAR_REF,
    id: Math.random() + '',
  };
};

function walk(children: Array<SourceChild>, index: number, walker: (child: SourceChild, index: number, children: Array<SourceChild>) => unknown): void {
  for (let i = index; i < children.length; i++) {
    const child = children[i];
    if (walker(child, i, children) === false) {
      break;
    }
    if (child != null && typeof child === 'object' && child.nodeType === TsNodeType.VAR_ASSIGNMENT) {
      walk(child.valueNode.children, 0, walker);
    }
  }
}

export function countVarRefs(children: Array<SourceChild>, index: number, id: string): number {
  let refCount = 0;
  walk(children, index, (child) => {
    return !(child != null && typeof child === 'object' && child.nodeType === TsNodeType.VAR_REF && child.id === id && ++refCount === 2);
  });
  return refCount;
}

export function inlineVars(children: Array<SourceChild>): void {
  walk(children, 0, (child, index, children) => {
    if (!(child != null && typeof child === 'object' && child.nodeType === TsNodeType.VAR_ASSIGNMENT)) {
      return;
    }
    
    const refCount = countVarRefs(children, index + 1, child.varRef.id);
    
    if (refCount < 2) {
      children[index] = '';
    }
    if (refCount === 1) {
      walk(children, index + 1, (child0, index, children) => {
        if (child0 != null && typeof child0 === 'object' && child0.nodeType === TsNodeType.VAR_REF && child0.id === child.varRef.id) {
          children[index] = '';
          children.splice(index + 1, 0, ...child.valueNode.children);
        }
      });
    }
  });
}
