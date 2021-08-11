import {CgNodeType, FragmentChild, IFragmentCgNode} from './ast-types';
import {CgTemplateChild, ICgTemplate} from './template-types';

export const template: ICgTemplate = function (strs): IFragmentCgNode {
  const children: Array<FragmentChild> = [];

  if (isTemplateStringsArray(strs)) {
    children.push(strs[0]);
    for (let i = 1; i < strs.length; i++) {
      appendChildren(children, arguments[i]);
      children.push(strs[i]);
    }
  } else {
    for (let i = 0; i < arguments.length; i++) {
      appendChildren(children, arguments[i]);
    }
  }

  return {
    nodeType: CgNodeType.FRAGMENT,
    children,
    retained: false,
  };
};

template.block = (...args) => {
  const node = template(...args);
  node.retained = true;
  return node;
};

template.assignment = (varRef, value, retained = false) => {
  return {
    nodeType: CgNodeType.VAR_ASSIGNMENT,
    varId: varRef.varId,
    children: template(value).children,
    retained: retained,
  };
};

let varCount = 0;

template.var = () => {
  return {
    nodeType: CgNodeType.VAR_REF,
    varId: 'var' + ++varCount,
    recyclable: false,
  };
};

function isTemplateStringsArray(value: unknown): value is TemplateStringsArray {
  return Array.isArray(value) && value.hasOwnProperty('raw');
}

function appendChildren(children: Array<FragmentChild>, child: CgTemplateChild): void {
  if (child == null) {
    return;
  }
  if (Array.isArray(child)) {
    for (let i = 0; i < child.length; i++) {
      appendChildren(children, child[i]);
    }
    return;
  }
  if (typeof child === 'object' && child.nodeType === CgNodeType.FRAGMENT && !child.retained) {
    appendChildren(children, child.children);
    return;
  }
  children.push(child);
}
